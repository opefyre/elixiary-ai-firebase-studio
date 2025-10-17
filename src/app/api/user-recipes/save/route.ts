import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { recipeId, userId, recipeData } = await request.json();

    if (!recipeId || !userId || !recipeData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if recipe is already saved
    const existingQuery = await adminDb
      .collection('user-saved-recipes')
      .where('userId', '==', userId)
      .where('recipeId', '==', recipeId)
      .limit(1)
      .get();

    if (!existingQuery.empty) {
      return NextResponse.json({ error: 'Recipe already saved' }, { status: 409 });
    }

    // Save the recipe
    const savedRecipe = {
      userId,
      recipeId,
      recipeData,
      savedAt: new Date(),
      isCurated: true,
      source: 'curated'
    };

    await adminDb.collection('user-saved-recipes').add(savedRecipe);

    return NextResponse.json({ 
      success: true, 
      message: 'Recipe saved successfully'
    });

  } catch (error: any) {
    console.error('Error saving recipe:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save recipe' },
      { status: 500 }
    );
  }
}
