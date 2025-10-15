import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { UserBadges } from '@/types/badges';
import { getBadgeStats, calculateBadgeProgress } from '@/lib/badges';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Get user badges document
    const userBadgesRef = adminDb.collection('user-badges').doc(userId);
    const userBadgesDoc = await userBadgesRef.get();

    if (!userBadgesDoc.exists) {
      // Initialize user badges if they don't exist
      const initialBadges: UserBadges = {
        badges: [],
        achievements: {
          recipesGenerated: 0,
          recipesSaved: 0,
          lastActivityDate: null,
          categoriesExplored: [],
          consecutiveDays: 0,
          maxRecipesInDay: 0,
          maxRecipesInMonth: 0,
        },
        lastUpdated: new Date(),
      };

      await userBadgesRef.set(initialBadges);
      
      return NextResponse.json({
        userBadges: initialBadges,
        stats: getBadgeStats(initialBadges),
        progress: calculateBadgeProgress(initialBadges.badges, initialBadges.achievements),
      });
    }

    const userBadges = userBadgesDoc.data() as UserBadges;
    const stats = getBadgeStats(userBadges);
    const progress = calculateBadgeProgress(userBadges.badges, userBadges.achievements);

    return NextResponse.json({
      userBadges,
      stats,
      progress,
    });

  } catch (error: any) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user badges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { userId, action, data } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const userBadgesRef = adminDb.collection('user-badges').doc(userId);
    const userBadgesDoc = await userBadgesRef.get();

    let userBadges: UserBadges;
    
    if (!userBadgesDoc.exists) {
      // Initialize user badges
      userBadges = {
        badges: [],
        achievements: {
          recipesGenerated: 0,
          recipesSaved: 0,
          lastActivityDate: null,
          categoriesExplored: [],
          consecutiveDays: 0,
          maxRecipesInDay: 0,
          maxRecipesInMonth: 0,
        },
        lastUpdated: new Date(),
      };
    } else {
      userBadges = userBadgesDoc.data() as UserBadges;
    }

    // Update achievements based on action
    const { updateAchievements } = await import('@/lib/badges');
    userBadges.achievements = updateAchievements(userBadges.achievements, action, data);
    userBadges.lastUpdated = new Date();

    // Check for new badges
    const { checkForNewBadges } = await import('@/lib/badges');
    const newBadgeIds = checkForNewBadges(
      userBadges.badges, 
      userBadges.achievements,
      data?.isEarlyBird || false
    );

    // Add new badges
    if (newBadgeIds.length > 0) {
      userBadges.badges = [...userBadges.badges, ...newBadgeIds];
    }

    // Save updated badges
    await userBadgesRef.set(userBadges);

    return NextResponse.json({
      success: true,
      newBadges: newBadgeIds,
      userBadges,
    });

  } catch (error: any) {
    console.error('Error updating user badges:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user badges' },
      { status: 500 }
    );
  }
}
