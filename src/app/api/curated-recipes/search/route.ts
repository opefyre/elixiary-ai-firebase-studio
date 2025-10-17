import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ recipes: [], total: 0 });
    }

    const searchLower = query.toLowerCase().trim();

    // Get all recipes and filter client-side (since Firestore composite indexes are complex)
    // This is acceptable for 495 recipes as it's a reasonable dataset size
    const allRecipesSnapshot = await adminDb.collection('curated-recipes')
      .orderBy('name', 'asc')
      .get();

    const allRecipes = allRecipesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter recipes based on search query
    const filteredRecipes = allRecipes.filter(recipe => {
      const name = recipe.name?.toLowerCase() || '';
      const ingredients = recipe.ingredients?.map((ing: any) => ing.name?.toLowerCase()).join(' ') || '';
      const tags = recipe.tags?.join(' ').toLowerCase() || '';
      const category = recipe.category?.toLowerCase() || '';
      
      const searchText = `${name} ${ingredients} ${tags} ${category}`;
      return searchText.includes(searchLower);
    });

    // Apply pagination
    const paginatedRecipes = filteredRecipes.slice(offset, offset + limit);
    const total = filteredRecipes.length;

    return NextResponse.json({ 
      recipes: paginatedRecipes, 
      total,
      hasMore: offset + paginatedRecipes.length < total
    });

  } catch (error: any) {
    console.error('Error searching curated recipes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search recipes' },
      { status: 500 }
    );
  }
}
