import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing user lookup...');
    const { adminDb } = initializeFirebaseServer();
    
    // Test the specific user ID from the API key
    const userId = 'RPVBxqLqmIdwBPjP73vYW5uY2xX2';
    console.log('Looking up user:', userId);
    
    const userDoc = await adminDb.collection('users').doc(userId).get();
    console.log('User document exists:', userDoc.exists);
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('User data:', {
        id: userDoc.id,
        email: userData?.email,
        subscriptionTier: userData?.subscriptionTier
      });
    }
    
    return NextResponse.json({
      success: true,
      userExists: userDoc.exists,
      userId: userId,
      userData: userDoc.exists ? {
        email: userDoc.data()?.email,
        subscriptionTier: userDoc.data()?.subscriptionTier
      } : null
    });
    
  } catch (error: any) {
    console.error('User test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
