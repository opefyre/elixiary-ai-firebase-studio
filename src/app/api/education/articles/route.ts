import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { z } from 'zod';
import { FieldPath } from 'firebase-admin/firestore';
import type { OrderByDirection, Query } from 'firebase-admin/firestore';
import { EducationArticle, PaginatedResponse } from '@/types/education';

const querySchema = z.object({
  category: z.string().nullable().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).nullable().optional(),
  search: z.string().nullable().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  sort: z.enum(['newest', 'oldest', 'popular', 'readingTime']).nullable().default('newest'),
});

export async function GET(request: NextRequest) {
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

    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

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

    const sortOrders: Array<{ field: string | FieldPath; direction: OrderByDirection }> = [];

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

    // Ensure deterministic ordering regardless of the requested sort
    sortOrders.push({ field: FieldPath.documentId(), direction: 'asc' });

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
      const data = doc.data();
      articles.push({
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
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : data.publishedAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        status: data.status,
        seo: data.seo,
        stats: data.stats || { views: 0, likes: 0, shares: 0 },
      });
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
