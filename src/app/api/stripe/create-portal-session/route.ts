import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  console.log('=== Customer Portal Session Request ===');
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not configured');
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  let stripe;
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
    console.log('Stripe initialized successfully');
  } catch (initError: any) {
    console.error('Failed to initialize Stripe:', initError);
    return NextResponse.json(
      { error: 'Failed to initialize Stripe', details: initError.message },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log('Request body received:', { hasCustomerId: !!body.customerId });
    const { customerId } = body;

    if (!customerId) {
      console.error('No customer ID provided');
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    console.log('Creating portal session for customer:', customerId);
    
    // Create the billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com'}/account`,
    });

    console.log('Portal session created successfully:', session.id);
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

