import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyFirebaseToken } from '@/lib/firebase-auth-verify';
import { initializeFirebaseServer } from '@/firebase/server';

const STRIPE_PRICES = {
  EARLY_BIRD_MONTHLY: process.env.STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID || 'price_early_monthly',
  EARLY_BIRD_ANNUAL: process.env.STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID || 'price_early_annual',
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  PRO_ANNUAL: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',
};

/**
 * Check if user is eligible for early bird pricing based on server-side rules
 */
async function checkEarlyBirdEligibility(adminDb: any): Promise<boolean> {
  try {
    const configRef = adminDb.collection('config').doc('earlyBird');
    const configSnap = await configRef.get();
    
    if (!configSnap.exists) {
      return false; // No early bird config exists
    }
    
    const config = configSnap.data();
    const isActive = config?.isActive || false;
    const currentCount = config?.count || 0;
    const maxCount = config?.maxCount || 50;
    
    // Only eligible if active and under the limit
    return isActive && currentCount < maxCount;
  } catch (error) {
    console.error('Error checking early bird eligibility:', error);
    return false; // Fail safe - no early bird if error
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

    // Initialize Stripe at runtime
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    const { planType } = await request.json();

    // Use authenticated user's data instead of client-provided values
    const userId = user.uid;
    const userEmail = user.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in authentication token' },
        { status: 400 }
      );
    }

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be "monthly" or "annual"' },
        { status: 400 }
      );
    }

    // Check early bird eligibility server-side
    const { adminDb } = initializeFirebaseServer();
    const isEarlyBirdEligible = await checkEarlyBirdEligibility(adminDb);

    // Determine price ID based on plan type and server-validated early bird status
    let priceId: string;
    if (isEarlyBirdEligible) {
      priceId = planType === 'monthly' 
        ? STRIPE_PRICES.EARLY_BIRD_MONTHLY 
        : STRIPE_PRICES.EARLY_BIRD_ANNUAL;
    } else {
      priceId = planType === 'monthly' 
        ? STRIPE_PRICES.PRO_MONTHLY 
        : STRIPE_PRICES.PRO_ANNUAL;
    }

    // Get or create Stripe customer
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      
      // 🚨 CHECK FOR EXISTING ACTIVE SUBSCRIPTIONS
      const existingSubscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      });

      if (existingSubscriptions.data.length > 0) {
        // User already has active subscription
        return NextResponse.json(
          { 
            error: 'You already have an active subscription',
            message: 'You already have an active Pro subscription. Visit your account page to manage it.'
          },
          { status: 409 } // 409 Conflict
        );
      }
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          firebaseUID: userId,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin')}/account?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin')}/pricing?canceled=true`,
      metadata: {
        firebaseUID: userId,
        isEarlyBird: isEarlyBirdEligible ? 'true' : 'false',
      },
      subscription_data: {
        metadata: {
          firebaseUID: userId,
          isEarlyBird: isEarlyBirdEligible ? 'true' : 'false',
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

