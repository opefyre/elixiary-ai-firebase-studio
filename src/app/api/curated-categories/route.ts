import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // Get all categories
    const categoriesSnapshot = await adminDb
      .collection('curated-categories')
      .orderBy('sortOrder', 'asc')
      .get();

    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ categories });

  } catch (error: any) {
    console.error('Error fetching curated categories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
