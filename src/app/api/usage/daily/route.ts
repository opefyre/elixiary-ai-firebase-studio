import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { getDailyUsageData } from '@/lib/daily-usage';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '7');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    if (days < 1 || days > 30) {
      return NextResponse.json({ error: 'Days must be between 1 and 30' }, { status: 400 });
    }

    const usageData = await getDailyUsageData(userId, adminDb, days);

    return NextResponse.json({ 
      usageData,
      totalGenerated: usageData.reduce((sum, day) => sum + day.recipesGenerated, 0),
      totalSaved: usageData.reduce((sum, day) => sum + day.recipesSaved, 0)
    });

  } catch (error: any) {
    console.error('Error fetching daily usage data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}
