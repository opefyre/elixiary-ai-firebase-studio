import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { EducationArticle, PaginatedResponse } from '@/types/education';
import { z } from 'zod';

const querySchema = z.object({
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  sort: z.enum(['newest', 'oldest', 'popular', 'readingTime']).default('newest'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    
    const query = querySchema.parse({
      difficulty: searchParams.get('difficulty'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sort: searchParams.get('sort'),
    });

    if (!slug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

    // Build query for articles in this category
    let queryBuilder = articlesRef
      .where('category', '==', slug)
      .where('status', '==', 'published');

    if (query.difficulty) {
      queryBuilder = queryBuilder.where('difficulty', '==', query.difficulty);
    }

    // Apply sorting
    switch (query.sort) {
      case 'newest':
        queryBuilder = queryBuilder.orderBy('publishedAt', 'desc');
        break;
      case 'oldest':
        queryBuilder = queryBuilder.orderBy('publishedAt', 'asc');
        break;
      case 'popular':
        queryBuilder = queryBuilder.orderBy('stats.views', 'desc');
        break;
      case 'readingTime':
        queryBuilder = queryBuilder.orderBy('readingTime', 'asc');
        break;
    }

    // Apply pagination
    const offset = (query.page - 1) * query.limit;
    queryBuilder = queryBuilder.offset(offset).limit(query.limit);

    const snapshot = await queryBuilder.get();
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
        publishedAt: data.publishedAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        status: data.status,
        seo: data.seo,
        stats: data.stats || { views: 0, likes: 0, shares: 0 },
      });
    });

    // Get total count for pagination
    const totalQuery = articlesRef
      .where('category', '==', slug)
      .where('status', '==', 'published');
    const totalSnapshot = await totalQuery.get();
    const total = totalSnapshot.size;

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
    console.error('Error fetching category articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category articles' },
      { status: 500 }
    );
  }
}
