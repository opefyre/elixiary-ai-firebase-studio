import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { verifyFirebaseToken } from '@/lib/firebase-auth-verify';

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authHeader = request.headers.get('authorization');
    const { user, error: authError } = await verifyFirebaseToken(authHeader);

    if (!user) {
      return NextResponse.json(
        { error: authError || 'Authentication required' },
        { status: 401 }
      );
    }

    const { adminDb } = initializeFirebaseServer();
    const { recipeId, recipeData } = await request.json();

    if (!recipeId || !recipeData) {
      return NextResponse.json({ error: 'Missing required fields: recipeId and recipeData' }, { status: 400 });
    }

    // Use authenticated user's UID instead of client-supplied userId
    const userId = user.uid;

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
