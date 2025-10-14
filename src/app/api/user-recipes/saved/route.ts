import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Get user's saved recipes (without orderBy to avoid index requirement)
    const query = await adminDb
      .collection('user-saved-recipes')
      .where('userId', '==', userId)
      .get();

    const savedRecipes = query.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by savedAt in descending order (newest first)
    savedRecipes.sort((a, b) => {
      const aTime = a.savedAt?.toDate?.() || new Date(a.savedAt);
      const bTime = b.savedAt?.toDate?.() || new Date(b.savedAt);
      return bTime.getTime() - aTime.getTime();
    });

    return NextResponse.json({ 
      savedRecipes,
      count: savedRecipes.length 
    });

  } catch (error: any) {
    console.error('Error fetching saved recipes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch saved recipes' },
      { status: 500 }
    );
  }
}
