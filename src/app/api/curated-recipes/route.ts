import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Get all recipes and filter client-side to avoid complex Firestore indexes
    const allRecipesSnapshot = await adminDb.collection('curated-recipes')
      .orderBy('name', 'asc')
      .get();

    let recipes = allRecipesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply filters
    if (category) {
      recipes = recipes.filter(recipe => recipe.categoryId === category);
    }
    if (difficulty) {
      recipes = recipes.filter(recipe => recipe.difficulty === difficulty);
    }
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