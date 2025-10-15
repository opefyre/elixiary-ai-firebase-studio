import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { trackRecipeUnsave } from '@/lib/daily-usage-admin';

export async function DELETE(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { recipeId, userId } = await request.json();

    if (!recipeId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find and delete the saved recipe
    const query = await adminDb
      .collection('user-saved-recipes')
      .where('userId', '==', userId)
      .where('recipeId', '==', recipeId)
      .limit(1)
      .get();

    if (query.empty) {
      return NextResponse.json({ error: 'Recipe not found in saved recipes' }, { status: 404 });
    }

    // Delete the document
    const doc = query.docs[0];
    await adminDb.collection('user-saved-recipes').doc(doc.id).delete();

    // Track daily usage
    await trackRecipeUnsave(userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Recipe removed from saved recipes' 
    });

  } catch (error: any) {
    console.error('Error unsaving recipe:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove recipe' },
      { status: 500 }
    );
  }
}
