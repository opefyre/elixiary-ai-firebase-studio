import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  console.log('Webhook received');
  
  // Initialize at runtime
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing Stripe configuration:', {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    });
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });

  let firestore;
  try {
    const firebase = initializeFirebaseServer();
    firestore = firebase.firestore;
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    return NextResponse.json(
      { error: 'Firebase initialization failed' },
      { status: 500 }
    );
  }
  
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    console.log(`Processing webhook event: ${event.type}`);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('Handling checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, stripe, firestore);
        console.log('Checkout completed successfully');
        break;
      }

      case 'customer.subscription.updated': {
        console.log('Handling customer.subscription.updated');
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, firestore);
        console.log('Subscription updated successfully');
        break;
      }

      case 'customer.subscription.deleted': {
        console.log('Handling customer.subscription.deleted');
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, firestore);
        console.log('Subscription deleted successfully');
        break;
      }

      case 'invoice.payment_succeeded': {
        console.log('Handling invoice.payment_succeeded');
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, stripe, firestore);
        console.log('Payment succeeded handled successfully');
        break;
      }

      case 'invoice.payment_failed': {
        console.log('Handling invoice.payment_failed');
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice, stripe, firestore);
        console.log('Payment failed handled successfully');
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    console.log('Webhook processed successfully');
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, firestore: any) {
  console.log('handleCheckoutCompleted called with session:', session.id);
  
  const userId = session.metadata?.firebaseUID;
  const isEarlyBird = session.metadata?.isEarlyBird === 'true';
  
  console.log('Session metadata:', { userId, isEarlyBird, metadata: session.metadata });

  if (!userId) {
    console.error('No firebaseUID in session metadata');
    throw new Error('No firebaseUID in session metadata');
  }

  console.log('Retrieving subscription:', session.subscription);
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );
  console.log('Subscription retrieved:', subscription.id);

  const userRef = firestore.collection('users').doc(userId);
  console.log('User ref created:', userId);
  
  // Get current early bird count if this is an early bird
  let earlyBirdNumber: number | undefined;
  if (isEarlyBird) {
    console.log('Processing early bird subscription');
    const configRef = firestore.collection('config').doc('earlyBird');
    const configSnap = await configRef.get();
    
    if (configSnap.exists) {
      const currentCount = configSnap.data()?.count || 0;
      earlyBirdNumber = currentCount + 1;
      console.log('Incrementing early bird count to:', earlyBirdNumber);
      
      // Increment early bird counter
      await configRef.update({
        count: earlyBirdNumber,
        isActive: earlyBirdNumber < 50,
      });
    } else {
      // Initialize early bird config
      earlyBirdNumber = 1;
      console.log('Initializing early bird config');
      await configRef.set({
        count: 1,
        isActive: true,
        maxCount: 50,
      });
    }
  }

  // Check if user document exists, create it if it doesn't
  console.log('Checking if user document exists...');
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    console.log('User document does not exist, creating new document');
    // Create user document with subscription data
    const userData = {
      subscriptionTier: 'pro',
      subscriptionStatus: subscription.status,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      isEarlyBird: isEarlyBird,
      ...(earlyBirdNumber && { earlyBirdNumber }),
      subscriptionStartDate: new Date(),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('Creating user document with data:', userData);
    await userRef.set(userData);
    console.log('User document created successfully');
  } else {
    console.log('User document exists, updating...');
    // Update existing user document
    const updateData = {
      subscriptionTier: 'pro',
      subscriptionStatus: subscription.status,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      isEarlyBird: isEarlyBird,
      ...(earlyBirdNumber && { earlyBirdNumber }),
      subscriptionStartDate: new Date(),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    };
    console.log('Updating user document with data:', updateData);
    await userRef.update(updateData);
    console.log('User document updated successfully');
  }

  console.log(`Subscription activated for user: ${userId}`, {
    isEarlyBird,
    earlyBirdNumber,
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, firestore: any) {
  const userId = subscription.metadata?.firebaseUID;

  if (!userId) {
    console.error('No firebaseUID in subscription metadata');
    return;
  }

  const userRef = firestore.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({
      subscriptionStatus: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    });
  }

  console.log(`Subscription updated for user: ${userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, firestore: any) {
  const userId = subscription.metadata?.firebaseUID;

  if (!userId) {
    console.error('No firebaseUID in subscription metadata');
    return;
  }

  const userRef = firestore.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({
      subscriptionTier: 'free',
      subscriptionStatus: 'expired',
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    });
  }

  console.log(`Subscription canceled for user: ${userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, stripe: Stripe, firestore: any) {
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );
  const userId = subscription.metadata?.firebaseUID;

  if (!userId) {
    console.error('No firebaseUID in subscription metadata');
    return;
  }

  const userRef = firestore.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({
      subscriptionStatus: 'active',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      updatedAt: new Date(),
    });
  }

  console.log(`Payment succeeded for user: ${userId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice, stripe: Stripe, firestore: any) {
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );
  const userId = subscription.metadata?.firebaseUID;

  if (!userId) {
    console.error('No firebaseUID in subscription metadata');
    return;
  }

  const userRef = firestore.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({
      subscriptionStatus: 'past_due',
      updatedAt: new Date(),
    });
  }

  console.log(`Payment failed for user: ${userId}`);
}

