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

    // Update user to Pro status
    const updateData = {
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
      stripeCustomerId: stripeCustomerId,
      stripeSubscriptionId: stripeSubscriptionId,
      subscriptionStartDate: new Date().toISOString(),
      cancelAtPeriodEnd: false,
      updatedAt: new Date().toISOString(),
      lastWebhookEvent: 'manual_fix',
      webhookSignature: 'manual_fix',
    };

    // Create audit trail entry
    const auditEntry = {
      timestamp: new Date(),
      event: 'manual_fix',
      from: currentData,
      to: updateData,
      source: 'manual' as const,
      webhookId: 'manual_fix',
    };

    // Add to subscription history
    const existingHistory = currentData.subscriptionHistory || [];
    updateData.subscriptionHistory = [...existingHistory, auditEntry].slice(-50);

    await userRef.update(updateData);

    return NextResponse.json({ 
      success: true, 
      message: 'User subscription fixed successfully',
      userId: userId,
      updatedFields: Object.keys(updateData)
    });

  } catch (error: any) {
    console.error('Error fixing subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
