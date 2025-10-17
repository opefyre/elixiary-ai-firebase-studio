import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Cap at 100 for performance
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Build optimized query using indexes
    let query = adminDb.collection('curated-recipes');

    // Apply indexed filters first (most selective)
    if (category) {
      query = query.where('category', '==', category);
    }
    
    if (difficulty) {
      query = query.where('difficulty', '==', difficulty);
    }

    // Order by indexed field for consistent pagination
    query = query.orderBy('name', 'asc');

    // Apply limit for performance
    query = query.limit(limit * 3); // Get more than needed for client-side filtering

    const snapshot = await query.get();
    let recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply client-side filters for complex queries (tags, search)
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

    // Apply pagination
    const total = recipes.length;
    const offset = (page - 1) * limit;
    const paginatedRecipes = recipes.slice(offset, offset + limit);

    return NextResponse.json({
      recipes: paginatedRecipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error: any) {
    console.error('Error fetching curated recipes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}