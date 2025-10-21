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
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Cap at 100 for performance
    const source = searchParams.get('source'); // 'curated' or 'ai'
    
    // Use authenticated user's UID instead of client-supplied userId
    const userId = user.uid;

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
