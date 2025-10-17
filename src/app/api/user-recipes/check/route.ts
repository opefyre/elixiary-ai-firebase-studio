import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');
    const userId = searchParams.get('userId');

    if (!recipeId || !userId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

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
