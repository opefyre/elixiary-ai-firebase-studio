import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { z } from 'zod';
import { EducationArticle, PaginatedResponse } from '@/types/education';

const querySchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  sort: z.enum(['newest', 'oldest', 'popular', 'readingTime']).default('newest'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      category: searchParams.get('category'),
      difficulty: searchParams.get('difficulty'),
      search: searchParams.get('search'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sort: searchParams.get('sort'),
    });

    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

    // Build query based on filters
    let queryBuilder = articlesRef.where('status', '==', 'published');

    if (query.category) {
      queryBuilder = queryBuilder.where('category', '==', query.category);
    }

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
    queryBuilder = queryBuilder.limit(query.limit);

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
        publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : data.publishedAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        status: data.status,
        seo: data.seo,
        stats: data.stats || { views: 0, likes: 0, shares: 0 },
      });
    });

    // Get total count for pagination
    const totalQuery = articlesRef.where('status', '==', 'published');
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
