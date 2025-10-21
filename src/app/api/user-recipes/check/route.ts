import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { verifyFirebaseToken } from '@/lib/firebase-auth-verify';

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');
    
    if (!recipeId) {
      return NextResponse.json({ error: 'Missing recipeId parameter' }, { status: 400 });
    }

    // Use authenticated user's UID instead of client-supplied userId
    const userId = user.uid;

    // Check if recipe is saved
    const query = await adminDb
      .collection('user-saved-recipes')
      .where('userId', '==', userId)
      .where('recipeId', '==', recipeId)
      .limit(1)
      .get();

    const isSaved = !query.empty;

    return NextResponse.json({ isSaved });

  } catch (error: any) {
    console.error('Error checking saved status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check saved status' },
      { status: 500 }
    );
  }
}
