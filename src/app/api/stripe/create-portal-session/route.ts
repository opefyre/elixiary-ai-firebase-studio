import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserByUid, verifyFirebaseToken } from '@/lib/firebase-auth-verify';

type PortalSessionRequestBody = {
  customerId?: string;
  userId?: string;
};

export async function POST(request: NextRequest) {
  console.log('=== Customer Portal Session Request ===');

  let body: PortalSessionRequestBody;
  try {
    body = await request.json();
  } catch (parseError) {
    console.error('Failed to parse request body for portal session:', parseError);
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { customerId, userId: userIdFromBody } = body ?? {};

  if (!customerId) {
    console.error('No customer ID provided');
    return NextResponse.json(
      { error: 'Customer ID is required' },
      { status: 400 }
    );
  }

  // Try both case variations for authorization header
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  const serviceKeyHeader = request.headers.get('x-internal-service-key');
  const expectedServiceKey = process.env.INTERNAL_SERVICE_KEY;
  
  console.log('=== Authorization Headers ===');
  console.log('Authorization header (lowercase):', request.headers.get('authorization'));
  console.log('Authorization header (uppercase):', request.headers.get('Authorization'));
  console.log('Final authHeader:', authHeader);
  console.log('Service key header:', serviceKeyHeader ? 'present' : 'not present');

  let authenticatedUserId: string | null = null;

  if (serviceKeyHeader) {
    if (!expectedServiceKey) {
      console.error('Internal service key header provided but INTERNAL_SERVICE_KEY is not configured');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (serviceKeyHeader !== expectedServiceKey) {
      console.warn('Invalid internal service key provided');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!userIdFromBody) {
      console.warn('Internal service key authentication requires a userId in the request body');
      return NextResponse.json(
        { error: 'userId is required when using internal service key' },
        { status: 400 }
      );
    }

    authenticatedUserId = userIdFromBody;
    console.log('Authenticated via internal service key for user:', authenticatedUserId);
  } else {
    const { user, error } = await verifyFirebaseToken(authHeader);

    if (!user) {
      console.warn('Firebase authentication failed for portal session:', error);
      return NextResponse.json(
        { error: 'Unauthorized', details: error || 'Invalid or missing token' },
        { status: 401 }
      );
    }

    authenticatedUserId = user.uid;
    console.log('Authenticated Firebase user for portal session:', authenticatedUserId);
  }

  if (!authenticatedUserId) {
    console.error('Unable to resolve authenticated user for portal session request');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userRecord = await getUserByUid(authenticatedUserId);

  if (!userRecord) {
    console.warn('No Firestore user found for portal session request:', authenticatedUserId);
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  const storedCustomerId =
    (userRecord as any).stripeCustomerId ||
    (userRecord as any).subscription?.stripeCustomerId;

  if (!storedCustomerId) {
    console.warn('Authenticated user missing Stripe customer ID in Firestore:', authenticatedUserId);
    return NextResponse.json(
      { error: 'No billing information found for user' },
      { status: 404 }
    );
  }

  if (storedCustomerId !== customerId) {
    console.warn('Customer ID mismatch for portal session request', {
      userId: authenticatedUserId,
      providedCustomerId: customerId,
      storedCustomerId,
    });
    return NextResponse.json(
      { error: 'Forbidden', details: 'Customer ID mismatch' },
      { status: 403 }
    );
  }

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

