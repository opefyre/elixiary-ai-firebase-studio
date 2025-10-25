import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    
    const articleIds = searchParams.get('ids')?.split(',') || [];
    
    const articles = [];
    
    for (const articleId of articleIds) {
      const doc = await adminDb.collection('education_articles').doc(articleId).get();
      if (doc.exists) {
        const data = doc.data();
        articles.push({
          id: doc.id,
          title: data?.title,
          slug: data?.slug,
          category: data?.category,
          contentLength: data?.content ? data.content.length : 0,
          content: data?.content || null
        });
      }
    }
    
    return NextResponse.json({
      articles,
      total: articles.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
