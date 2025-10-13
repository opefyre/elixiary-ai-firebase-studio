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
    const tags = searchParams.get('tags')?.split(',');
    const moods = searchParams.get('moods')?.split(',');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build query
    let query = adminDb.collection('curated-recipes');

    // Apply filters
    if (category) {
      query = query.where('categoryId', '==', category);
    }
    if (difficulty) {
      query = query.where('difficulty', '==', difficulty);
    }
    if (tags && tags.length > 0) {
      query = query.where('tags', 'array-contains-any', tags);
    }
    if (moods && moods.length > 0) {
      query = query.where('moods', 'array-contains-any', moods);
    }

    // Apply sorting
    query = query.orderBy(sortBy, sortOrder as 'asc' | 'desc');

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.offset(offset).limit(limit);

    // Execute query
    const snapshot = await query.get();
    const recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // If search is provided, filter results client-side
    let filteredRecipes = recipes;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some((ing: any) => 
          ing.name.toLowerCase().includes(searchLower) ||
          ing.ingredient.toLowerCase().includes(searchLower)
        ) ||
        recipe.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Get total count for pagination
    const totalSnapshot = await adminDb.collection('curated-recipes').get();
    const total = totalSnapshot.size;

    return NextResponse.json({
      recipes: filteredRecipes,
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
