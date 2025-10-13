import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const recipeId = params.id;

    // Get recipe
    const recipeDoc = await adminDb.collection('curated-recipes').doc(recipeId).get();
    
    if (!recipeDoc.exists) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    const recipe = {
      id: recipeDoc.id,
      ...recipeDoc.data()
    };

    // Get related recipes (same category, limit 4)
    const relatedQuery = adminDb
      .collection('curated-recipes')
      .where('categoryId', '==', recipe.categoryId)
      .where('__name__', '!=', recipeId)
      .limit(4);

    const relatedSnapshot = await relatedQuery.get();
    const relatedRecipes = relatedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      recipe,
      relatedRecipes
    });

  } catch (error: any) {
    console.error('Error fetching curated recipe:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}
