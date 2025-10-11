import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });

  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Create the billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ai.elixiary.com'}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
    });
    
    // Return more specific error message
    return NextResponse.json(
      { 
        error: 'Failed to create portal session',
        details: error.message,
        hint: 'Make sure Stripe Customer Portal is activated in your Stripe Dashboard'
      },
      { status: 500 }
    );
  }
}

