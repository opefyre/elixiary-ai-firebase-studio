import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { verifyFirebaseToken } from '@/lib/firebase-auth-verify';
import { UserBadges } from '@/types/badges';
import { getBadgeStats, calculateBadgeProgress, updateAchievements } from '@/lib/badges';
import { trackRecipeGeneration, trackRecipeSave } from '@/lib/daily-usage-admin';

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
    
    // Use authenticated user's UID instead of client-supplied userId
    const userId = user.uid;

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

    const rawData = userBadgesDoc.data();
    
    // Convert Firestore timestamps to Date objects
    const userBadges: UserBadges = {
      ...rawData,
      achievements: {
        ...rawData.achievements,
        lastActivityDate: rawData.achievements?.lastActivityDate?.toDate?.() || null,
      },
      lastUpdated: rawData.lastUpdated?.toDate?.() || new Date(),
    } as UserBadges;
    
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
    const { action, data } = await request.json();

    if (!action) {
      return NextResponse.json({ error: 'Missing required parameter: action' }, { status: 400 });
    }

    // Use authenticated user's UID instead of client-supplied userId
    const userId = user.uid;

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
      const rawData = userBadgesDoc.data();
      
      // Convert Firestore timestamps to Date objects
      userBadges = {
        ...rawData,
        achievements: {
          ...rawData.achievements,
          lastActivityDate: rawData.achievements?.lastActivityDate?.toDate?.() || null,
        },
        lastUpdated: rawData.lastUpdated?.toDate?.() || new Date(),
      } as UserBadges;
    }

    // Update achievements based on action
    userBadges.achievements = updateAchievements(userBadges.achievements, action, data);
    userBadges.lastUpdated = new Date();

    // Track daily usage based on action
    try {
      if (action === 'recipe_generated') {
        await trackRecipeGeneration(userId);
      } else if (action === 'recipe_saved') {
        await trackRecipeSave(userId);
      }
    } catch (error) {
      console.error('Error tracking daily usage:', error);
    }

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
