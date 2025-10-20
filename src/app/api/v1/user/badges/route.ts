import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const authenticator = new APIAuthenticator();
    const { user, rateLimit } = await authenticator.authenticateRequest(request);
    
    const { adminDb } = initializeFirebaseServer();
    
    // Get user's badges using the composite index
    const badgesSnapshot = await adminDb
      .collection('user-badges')
      .where('userId', '==', user.uid)
      .orderBy('earnedAt', 'desc')
      .get();
    
    const badges = badgesSnapshot.docs.map(doc => ({
      id: doc.id,
      badgeType: doc.data().badgeType,
      badgeName: doc.data().badgeName,
      badgeDescription: doc.data().badgeDescription,
      badgeIcon: doc.data().badgeIcon,
      earnedAt: doc.data().earnedAt
    }));
    
    const response = {
      badges,
      totalBadges: badges.length,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    };
    
    return NextResponse.json(authenticator.createSuccessResponse(response, rateLimit));
    
  } catch (error: any) {
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user badges' },
      { status: 500 }
    );
  }
}
