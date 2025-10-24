import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { EducationArticle, PaginatedResponse, SearchFilters } from '@/types/education';
import { z } from 'zod';

const querySchema = z.object({
  q: z.string().min(1),
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      q: searchParams.get('q'),
      category: searchParams.get('category'),
      difficulty: searchParams.get('difficulty'),
      tags: searchParams.get('tags'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });

    if (!query.q || query.q.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

    // Start with published articles
    let queryBuilder = articlesRef.where('status', '==', 'published');

    // Apply filters
    if (query.category) {
      queryBuilder = queryBuilder.where('category', '==', query.category);
    }

    if (query.difficulty) {
      queryBuilder = queryBuilder.where('difficulty', '==', query.difficulty);
    }

    // Order by relevance (we'll implement basic text search for now)
    queryBuilder = queryBuilder.orderBy('publishedAt', 'desc');

    // Apply pagination - Firestore doesn't support offset, so we'll get all results and paginate on the client
    queryBuilder = queryBuilder.limit(100); // Get more results for client-side pagination

    const snapshot = await queryBuilder.get();
    const articles: EducationArticle[] = [];

    // Filter by search query on the client side for now
    // In production, you'd want to use Algolia or similar for better search
    const searchQuery = query.q.toLowerCase();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Simple text search in title, excerpt, content, and tags
      const searchableText = [
        data.title,
        data.excerpt,
        data.content,
        ...(data.tags || []),
        data.category,
      ].join(' ').toLowerCase();

      if (searchableText.includes(searchQuery)) {
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
      }
    });

    // For now, we'll return the filtered results
    // In production, you'd want to implement proper pagination with search
    const total = articles.length;
    const paginatedArticles = articles.slice(0, query.limit);

    const response: PaginatedResponse<EducationArticle> = {
      data: paginatedArticles,
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
    console.error('Error searching education articles:', error);
    return NextResponse.json(
      { error: 'Failed to search articles' },
      { status: 500 }
    );
  }
}
