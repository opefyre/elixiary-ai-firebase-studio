import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

    // Get ALL articles without limit
    const snapshot = await articlesRef.get();
    
    const articles = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        contentLength: data.content ? data.content.length : 0,
        category: data.category
      });
    });

    return NextResponse.json({
      total: articles.length,
      articles: articles
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
