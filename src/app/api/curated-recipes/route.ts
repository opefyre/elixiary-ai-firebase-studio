import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = await initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    console.log('Query params:', { page, limit, category, difficulty, search, tags });

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

    // Get all matching documents (we'll paginate client-side for now)
    const snapshot = await query.get();
    let recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`Found ${recipes.length} recipes before filtering`);

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

    console.log(`Found ${recipes.length} recipes after filtering`);

    // Apply pagination
    const total = recipes.length;
    const offset = (page - 1) * limit;
    const paginatedRecipes = recipes.slice(offset, offset + limit);

    console.log(`Returning ${paginatedRecipes.length} recipes for page ${page}`);

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
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}