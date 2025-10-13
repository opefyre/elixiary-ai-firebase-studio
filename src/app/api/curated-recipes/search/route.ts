import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ recipes: [], total: 0 });
    }

    const searchLower = query.toLowerCase().trim();

    // Search across all recipes using array-contains for keywords
    let searchQuery = adminDb.collection('curated-recipes')
      .where('searchKeywords', 'array-contains', searchLower)
      .orderBy('name', 'asc')
      .offset(offset)
      .limit(limit);

    const snapshot = await searchQuery.get();
    const recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get total count for search results
    const countSnapshot = await adminDb.collection('curated-recipes')
      .where('searchKeywords', 'array-contains', searchLower)
      .count()
      .get();

    const total = countSnapshot.data().count;

    return NextResponse.json({ 
      recipes, 
      total,
      hasMore: offset + recipes.length < total
    });

  } catch (error: any) {
    console.error('Error searching curated recipes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search recipes' },
      { status: 500 }
    );
  }
}
