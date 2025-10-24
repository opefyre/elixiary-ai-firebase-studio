import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { z } from 'zod';

const analyticsSchema = z.object({
  type: z.enum(['view', 'interaction']),
  articleId: z.string().optional(),
  userId: z.string().optional(),
  data: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = analyticsSchema.parse(body);

    const { adminDb } = initializeFirebaseServer();
    const analyticsRef = adminDb.collection('education_analytics');

    const analyticsData = {
      type: validatedData.type,
      articleId: validatedData.articleId,
      userId: validatedData.userId,
      timestamp: new Date(),
      data: validatedData.data || {},
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    };

    await analyticsRef.add(analyticsData);

    // If it's a view, update the article's view count
    if (validatedData.type === 'view' && validatedData.articleId) {
      const articleRef = adminDb.collection('education_articles').doc(validatedData.articleId);
      const articleDoc = await articleRef.get();
      if (articleDoc.exists) {
        const currentData = articleDoc.data();
        const currentViews = currentData?.stats?.views || 0;
        await articleRef.update({
          'stats.views': currentViews + 1,
        });
      }
    }

    return NextResponse.json({
      message: 'Analytics recorded successfully',
    });
  } catch (error: any) {
    console.error('Error recording analytics:', error);
    return NextResponse.json(
      { error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const articleId = searchParams.get('articleId');
    const days = parseInt(searchParams.get('days') || '30');

    const { adminDb } = initializeFirebaseServer();
    const analyticsRef = adminDb.collection('education_analytics');

    let query = analyticsRef;
    
    if (type) {
      query = query.where('type', '==', type);
    }
    
    if (articleId) {
      query = query.where('articleId', '==', articleId);
    }

    // Filter by date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    query = query.where('timestamp', '>=', startDate);

    const snapshot = await query.get();
    const analytics = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    }));

    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
