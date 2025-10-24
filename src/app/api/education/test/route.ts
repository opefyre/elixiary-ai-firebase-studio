import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');
    const snapshot = await articlesRef.get();
    
    return NextResponse.json({
      message: 'Test successful',
      count: snapshot.size,
      docs: snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        status: doc.data().status
      }))
    });
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    );
  }
}
