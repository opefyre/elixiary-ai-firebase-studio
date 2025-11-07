import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserByUid, verifyFirebaseToken } from '@/lib/firebase-auth-verify';

type PortalSessionRequestBody = {
  customerId?: string;
  userId?: string;
};

export async function POST(request: NextRequest) {
  let body: PortalSessionRequestBody;
  try {
    body = await request.json();
  } catch (parseError) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { customerId, userId: userIdFromBody } = body ?? {};

  if (!customerId) {
    return NextResponse.json(
      { error: 'Customer ID is required' },
      { status: 400 }
    );
  }

  // Get authorization header (Next.js normalizes headers to lowercase)
  const authHeader = request.headers.get('authorization');
  const serviceKeyHeader = request.headers.get('x-internal-service-key');
  const expectedServiceKey = process.env.INTERNAL_SERVICE_KEY;

  let authenticatedUserId: string | null = null;

  if (serviceKeyHeader) {
    if (!expectedServiceKey || serviceKeyHeader !== expectedServiceKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!userIdFromBody) {
      return NextResponse.json(
        { error: 'userId is required when using internal service key' },
        { status: 400 }
      );
    }

    authenticatedUserId = userIdFromBody;
  } else {
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user, error } = await verifyFirebaseToken(authHeader);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    authenticatedUserId = user.uid;
  }

  if (!authenticatedUserId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userRecord = await getUserByUid(authenticatedUserId);

  if (!userRecord) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  const storedCustomerId =
    (userRecord as any).stripeCustomerId ||
    (userRecord as any).subscription?.stripeCustomerId;

  if (!storedCustomerId) {
    return NextResponse.json(
      { error: 'No billing information found for user' },
      { status: 404 }
    );
  }

  if (storedCustomerId !== customerId) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  let stripe;
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  } catch (initError: any) {
    return NextResponse.json(
      { error: 'Failed to initialize Stripe' },
      { status: 500 }
    );
  }

  try {
    // Create the billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.elixiary.com'}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Failed to create portal session'
      },
      { status: 500 }
    );
  }
}

