import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Build query
    let query = adminDb.collection('curated-tags');

    // Filter by type if provided
    if (type) {
      query = query.where('type', '==', type);
    }

    // Order by count descending
    query = query.orderBy('count', 'desc');

    const snapshot = await query.get();
    const tags = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ tags });

  } catch (error: any) {
    console.error('Error fetching curated tags:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
