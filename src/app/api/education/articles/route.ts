import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { z } from 'zod';
import type {
  CollectionReference,
  OrderByDirection,
  Query,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { EducationArticle, PaginatedResponse } from '@/types/education';

const querySchema = z.object({
  category: z.string().nullable().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).nullable().optional(),
  search: z.string().nullable().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  sort: z.enum(['newest', 'oldest', 'popular', 'readingTime']).nullable().default('newest'),
});

type ArticleQueryParams = z.infer<typeof querySchema>;

type ArticleWithTokens = {
  article: EducationArticle;
  searchTokens: string[];
};

function isMissingIndexError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const firestoreError = error as { code?: unknown; message?: unknown };

  return (
    firestoreError.code === 9 ||
    (typeof firestoreError.message === 'string' &&
      firestoreError.message.toLowerCase().includes('requires an index'))
  );
}

function toDate(value: any): Date {
  if (value?.toDate) {
    return value.toDate();
  }

  return value instanceof Date ? value : new Date(value);
}

function mapArticleFromSnapshot(doc: QueryDocumentSnapshot): ArticleWithTokens {
  const data = doc.data();

  const article: EducationArticle = {
    id: doc.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    featuredImage: data.featuredImage,
    category: data.category,
    difficulty: data.difficulty,
    readingTime: data.readingTime,
    tags: data.tags || [],
    author: data.author,
    publishedAt: toDate(data.publishedAt),
    updatedAt: toDate(data.updatedAt),
    status: data.status,
    seo: data.seo,
    stats: data.stats || { views: 0, likes: 0, shares: 0 },
  };

  const searchTokens = Array.isArray(data.searchTokens)
    ? data.searchTokens.map((token: unknown) => String(token))
    : [];

  return { article, searchTokens };
}

function sortArticlesInMemory(
  articles: EducationArticle[],
  sortOrder: ArticleQueryParams['sort']
) {
  const articlesCopy = [...articles];

  switch (sortOrder) {
    case 'oldest':
      return articlesCopy.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
    case 'popular':
      return articlesCopy.sort((a, b) => {
        const viewsDiff = (b.stats?.views ?? 0) - (a.stats?.views ?? 0);

        if (viewsDiff !== 0) {
          return viewsDiff;
        }

        return b.publishedAt.getTime() - a.publishedAt.getTime();
      });
    case 'readingTime':
      return articlesCopy.sort((a, b) => {
        const readingDiff = (a.readingTime ?? 0) - (b.readingTime ?? 0);

        if (readingDiff !== 0) {
          return readingDiff;
        }

        return b.publishedAt.getTime() - a.publishedAt.getTime();
      });
    case 'newest':
    default:
      return articlesCopy.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
}

function filterArticlesBySearch(
  articles: ArticleWithTokens[],
  searchQuery: ArticleQueryParams['search']
) {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return articles;
  }

  const tokens = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return articles;
  }

  return articles.filter(({ article, searchTokens }) => {
    if (!searchTokens.length) {
      return false;
    }

    const normalizedTokens = searchTokens.map((token) => token.toLowerCase());

    if (tokens.length === 1) {
      return normalizedTokens.includes(tokens[0]);
    }

    return tokens.some((token) => normalizedTokens.includes(token));
  });
}

async function buildFallbackResponse(
  articlesRef: CollectionReference,
  query: ArticleQueryParams
): Promise<PaginatedResponse<EducationArticle>> {
  const snapshot = await articlesRef.where('status', '==', 'published').get();

  let articlesWithTokens = snapshot.docs.map(mapArticleFromSnapshot);

  if (query.category) {
    articlesWithTokens = articlesWithTokens.filter(
      ({ article }) => article.category === query.category
    );
  }

  if (query.difficulty) {
    articlesWithTokens = articlesWithTokens.filter(
      ({ article }) => article.difficulty === query.difficulty
    );
  }

  articlesWithTokens = filterArticlesBySearch(articlesWithTokens, query.search);

  const filteredArticles = articlesWithTokens.map(({ article }) => article);
  const sortedArticles = sortArticlesInMemory(filteredArticles, query.sort);

  const total = sortedArticles.length;
  const startIndex = (query.page - 1) * query.limit;
  const paginatedArticles =
    startIndex < sortedArticles.length
      ? sortedArticles.slice(startIndex, startIndex + query.limit)
      : [];

  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

  return {
    data: paginatedArticles,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1 && total > 0,
    },
  };
}

export async function GET(request: NextRequest) {
  let articlesRef: CollectionReference | null = null;
  let parsedQuery: ArticleQueryParams | null = null;

  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      category: searchParams.get('category'),
      difficulty: searchParams.get('difficulty'),
      search: searchParams.get('search'),
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      sort: searchParams.get('sort') || 'newest',
    });

    parsedQuery = query;

    const { adminDb } = initializeFirebaseServer();
    articlesRef = adminDb.collection('education_articles');

    // Build query based on filters
    let filteredQuery = articlesRef.where('status', '==', 'published');

    if (query.category) {
      filteredQuery = filteredQuery.where('category', '==', query.category);
    }

    if (query.difficulty) {
      filteredQuery = filteredQuery.where('difficulty', '==', query.difficulty);
    }

    if (query.search && query.search.trim().length > 0) {
      const searchTokens = query.search.trim().toLowerCase().split(/\s+/).filter(Boolean);

      if (searchTokens.length === 1) {
        filteredQuery = filteredQuery.where('searchTokens', 'array-contains', searchTokens[0]);
      } else if (searchTokens.length > 1) {
        filteredQuery = filteredQuery.where(
          'searchTokens',
          'array-contains-any',
          searchTokens.slice(0, 10)
        );
      }
    }

    const sortOrders: Array<{ field: string; direction: OrderByDirection }> = [];

    switch (query.sort) {
      case 'oldest':
        sortOrders.push({ field: 'publishedAt', direction: 'asc' });
        break;
      case 'popular':
        sortOrders.push({ field: 'stats.views', direction: 'desc' });
        sortOrders.push({ field: 'publishedAt', direction: 'desc' });
        break;
      case 'readingTime':
        sortOrders.push({ field: 'readingTime', direction: 'asc' });
        sortOrders.push({ field: 'publishedAt', direction: 'desc' });
        break;
      case 'newest':
      default:
        sortOrders.push({ field: 'publishedAt', direction: 'desc' });
        break;
    }

    let orderedQuery: Query = filteredQuery;
    for (const { field, direction } of sortOrders) {
      orderedQuery = orderedQuery.orderBy(field, direction);
    }

    let total: number;
    try {
      const totalSnapshot = await filteredQuery.count().get();
      total = totalSnapshot.data().count;
    } catch (error) {
      const fallbackSnapshot = await filteredQuery.get();
      total = fallbackSnapshot.size;
    }

    const offset = (query.page - 1) * query.limit;
    if (offset > 0) {
      orderedQuery = orderedQuery.offset(offset);
    }

    orderedQuery = orderedQuery.limit(query.limit);

    const snapshot = await orderedQuery.get();
    const articles: EducationArticle[] = [];

    snapshot.forEach((doc) => {
      const { article } = mapArticleFromSnapshot(doc);
      articles.push(article);
    });

    const response: PaginatedResponse<EducationArticle> = {
      data: articles,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
        hasNext: query.page < Math.ceil(total / query.limit),
        hasPrev: query.page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (isMissingIndexError(error) && articlesRef && parsedQuery) {
      try {
        console.warn(
          'Missing Firestore index for education articles query. Using fallback processing.'
        );
        const fallbackResponse = await buildFallbackResponse(articlesRef, parsedQuery);
        return NextResponse.json(fallbackResponse);
      } catch (fallbackError) {
        console.error('Fallback processing for education articles failed:', fallbackError);
      }
    }

    console.error('Error fetching education articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    const body = await request.json();
    
    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

    // Validate required fields
    const requiredFields = ['title', 'slug', 'excerpt', 'content', 'category', 'difficulty'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if slug already exists
    const existingArticle = await articlesRef.where('slug', '==', body.slug).get();
    if (!existingArticle.empty) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }

    const articleData = {
      ...body,
      publishedAt: new Date(),
      updatedAt: new Date(),
      status: body.status || 'draft',
      stats: { views: 0, likes: 0, shares: 0 },
      tags: body.tags || [],
      seo: body.seo || { metaDescription: '', keywords: [] },
    };

    const docRef = await articlesRef.add(articleData);

    return NextResponse.json({
      id: docRef.id,
      message: 'Article created successfully',
    });
  } catch (error: any) {
    console.error('Error creating education article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
