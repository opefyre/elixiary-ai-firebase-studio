import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, stripeCustomerId, stripeSubscriptionId } = await request.json();

    if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, stripeCustomerId, stripeSubscriptionId' },
        { status: 400 }
      );
    }

    const { adminDb } = await initializeFirebaseServer();
    const userRef = adminDb.collection('users').doc(userId);

    // Get current user data
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentData = userDoc.data() || {};

    // Update user to Pro status - update fields one by one to avoid circular reference
    await userRef.update({
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
      stripeCustomerId: stripeCustomerId,
      stripeSubscriptionId: stripeSubscriptionId,
      subscriptionStartDate: new Date().toISOString(),
      cancelAtPeriodEnd: false,
      updatedAt: new Date().toISOString(),
      lastWebhookEvent: 'manual_fix',
      webhookSignature: 'manual_fix',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User subscription fixed successfully',
      userId: userId,
      updatedFields: ['subscriptionTier', 'subscriptionStatus', 'stripeCustomerId', 'stripeSubscriptionId', 'subscriptionStartDate', 'cancelAtPeriodEnd', 'updatedAt', 'lastWebhookEvent', 'webhookSignature']
    });

  } catch (error: any) {
    console.error('Error fixing subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
