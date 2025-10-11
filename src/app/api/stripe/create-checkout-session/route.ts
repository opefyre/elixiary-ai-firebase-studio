import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_PRICES = {
  EARLY_BIRD_MONTHLY: process.env.STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID || 'price_early_monthly',
  EARLY_BIRD_ANNUAL: process.env.STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID || 'price_early_annual',
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  PRO_ANNUAL: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',
};

export async function POST(request: NextRequest) {
  try {
    // Initialize Stripe at runtime
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });

    const { planType, userId, userEmail, isEarlyBird } = await request.json();

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: userId or userEmail' },
        { status: 400 }
      );
    }

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be "monthly" or "annual"' },
        { status: 400 }
      );
    }

    // Determine price ID based on plan type and early bird status
    let priceId: string;
    if (isEarlyBird) {
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
        isEarlyBird: isEarlyBird ? 'true' : 'false',
      },
      subscription_data: {
        metadata: {
          firebaseUID: userId,
          isEarlyBird: isEarlyBird ? 'true' : 'false',
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

