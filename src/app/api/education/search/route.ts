import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { EducationArticle, PaginatedResponse } from '@/types/education';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!searchQuery || searchQuery.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

    // Simple query without complex filters to avoid index issues
    const snapshot = await articlesRef.where('status', '==', 'published').limit(50).get();
    const articles: EducationArticle[] = [];

    // Filter by search query on the client side
    const searchTerm = searchQuery.toLowerCase();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Simple text search in title, excerpt, content, and tags
      const searchableText = [
        data.title || '',
        data.excerpt || '',
        data.content || '',
        ...(data.tags || []),
        data.category || '',
      ].join(' ').toLowerCase();

      if (searchableText.includes(searchTerm)) {
        articles.push({
          id: doc.id,
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          featuredImage: data.featuredImage,
          category: data.category || '',
          difficulty: data.difficulty || 'beginner',
          readingTime: data.readingTime || 5,
          tags: data.tags || [],
          author: data.author || { name: 'Elixiary Team', avatar: '' },
          publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
          status: data.status || 'published',
          seo: data.seo || {},
          stats: data.stats || { views: 0, likes: 0, shares: 0 },
        });
      }
    });

    // Limit results
    const limitedArticles = articles.slice(0, limit);

    const response: PaginatedResponse<EducationArticle> = {
      data: limitedArticles,
      pagination: {
        page: 1,
        limit: limit,
        total: articles.length,
        totalPages: Math.ceil(articles.length / limit),
        hasNext: articles.length > limit,
        hasPrev: false,
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
