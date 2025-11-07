import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { CacheManager } from '@/lib/redis';
import RequestDeduplicator from '@/lib/request-deduplicator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Create cache key
    const cacheKey = `curated-recipes:${JSON.stringify({
      page,
      limit,
      category,
      difficulty,
      search,
      tags
    })}`;

    // Check cache first
    const cached = await CacheManager.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Use request deduplication to prevent duplicate processing
    const deduplicator = RequestDeduplicator.getInstance();
    const dedupKey = RequestDeduplicator.createCacheKey('curated-recipes', {
      page,
      limit,
      category,
      difficulty,
      search,
      tags
    });

    const response = await deduplicator.deduplicate(dedupKey, async () => {
      const { adminDb } = await initializeFirebaseServer();

    // Build query based on available filters
    let query = adminDb.collection('curated-recipes');

    // Apply filters in the correct order for index usage
    if (category && difficulty) {
      // Use composite index: category + difficulty + name
      query = query
        .where('category', '==', category)
        .where('difficulty', '==', difficulty)
        .orderBy('name', 'asc');
    } else if (category) {
      // Use composite index: category + name
      query = query
        .where('category', '==', category)
        .orderBy('name', 'asc');
    } else if (difficulty) {
      // Use single field index: difficulty
      query = query
        .where('difficulty', '==', difficulty)
        .orderBy('name', 'asc');
    } else {
      // No filters, just order by name
      query = query.orderBy('name', 'asc');
    }

    // Apply pagination BEFORE fetching (server-side pagination)
    const offset = (page - 1) * limit;
    query = query.offset(offset).limit(limit);
    
    // Get only the documents we need
    const snapshot = await query.get();
    let recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply client-side filters for complex queries (tags, search)
    // Note: This now only filters the small paginated result set
    if (tags && tags.length > 0) {
      recipes = recipes.filter(recipe => 
        tags.some(tag => recipe.tags && recipe.tags.includes(tag))
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      recipes = recipes.filter(recipe => {
        const name = recipe.name?.toLowerCase() || '';
        const ingredients = recipe.ingredients?.map((ing: any) => ing.name?.toLowerCase()).join(' ') || '';
        const tags = recipe.tags?.join(' ').toLowerCase() || '';
        const category = recipe.category?.toLowerCase() || '';
        
        const searchText = `${name} ${ingredients} ${tags} ${category}`;
        return searchText.includes(searchLower);
      });
    }

    // For pagination info, we need to get total count separately
    // This is a limitation of server-side pagination with client-side filtering
    const totalQuery = adminDb.collection('curated-recipes');
    if (category && difficulty) {
      totalQuery.where('category', '==', category).where('difficulty', '==', difficulty);
    } else if (category) {
      totalQuery.where('category', '==', category);
    } else if (difficulty) {
      totalQuery.where('difficulty', '==', difficulty);
    }
    const totalSnapshot = await totalQuery.get();
    const total = totalSnapshot.size;

      const response = {
        recipes: recipes.map(recipe => ({
          id: recipe.id,
          name: recipe.name,
          prepTime: recipe.prepTime,
          glassware: recipe.glassware,
          difficulty: recipe.difficulty,
          tags: recipe.tags || [],
          imageUrl: recipe.imageUrl ?? null
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };

      // Cache the response for 5 minutes
      await CacheManager.set(cacheKey, JSON.stringify(response), 300);

      return response;
    });

    return NextResponse.json(response);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}