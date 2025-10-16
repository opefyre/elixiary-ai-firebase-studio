import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Cap at 100 for performance
    const source = searchParams.get('source'); // 'curated' or 'ai'

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Build optimized query using indexes
    let query = adminDb
      .collection('user-saved-recipes')
      .where('userId', '==', userId);

    // Apply source filter if provided
    if (source) {
      query = query.where('source', '==', source);
    }

    // Order by savedAt using the composite index
    query = query.orderBy('savedAt', 'desc');

    // Apply limit for performance
    query = query.limit(limit);

    const snapshot = await query.get();
    const savedRecipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

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
