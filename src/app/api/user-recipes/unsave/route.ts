import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { verifyFirebaseToken } from '@/lib/firebase-auth-verify';

export async function DELETE(request: NextRequest) {
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
    const { recipeId } = await request.json();

    if (!recipeId) {
      return NextResponse.json({ error: 'Missing recipeId field' }, { status: 400 });
    }

    // Use authenticated user's UID instead of client-supplied userId
    const userId = user.uid;

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
