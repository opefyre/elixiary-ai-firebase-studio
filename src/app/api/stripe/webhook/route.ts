import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  // Initialize Stripe and Firebase at runtime
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
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
  } catch (error: any) {
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
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Replay attack prevention: Check timestamp
  const now = Math.floor(Date.now() / 1000);
  const eventTime = event.created;
  const timeDiff = Math.abs(now - eventTime);
  
  // Reject events older than 5 minutes (300 seconds)
  if (timeDiff > 300) {
    return NextResponse.json(
      { error: 'Webhook event too old' },
      { status: 400 }
    );
  }

  // Idempotency check: Prevent processing duplicate events
  try {
    const { adminDb } = initializeFirebaseServer();
    const eventId = `stripe_webhook_${event.id}`;
    const processedEventRef = adminDb.collection('processed_webhooks').doc(eventId);
    
    const existingEvent = await processedEventRef.get();
    if (existingEvent.exists) {
      return NextResponse.json({ received: true, idempotent: true });
    }
    
    // Mark event as being processed
    await processedEventRef.set({
      eventId: event.id,
      eventType: event.type,
      processedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expire after 24 hours
    });
  } catch (idempotencyError) {
    // Don't fail the webhook if idempotency check fails, but log it
    // Fall through to process the event
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, stripe, firestore);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription, stripe, firestore);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, firestore);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, firestore);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, stripe, firestore);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice, stripe, firestore);
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, firestore: any) {
  const userId = session.metadata?.firebaseUID;
  const isEarlyBird = session.metadata?.isEarlyBird === 'true';

  if (!userId) {
    throw new Error('No firebaseUID in session metadata');
  }

  // Check if subscription exists in the session
  if (!session.subscription) {
    return; // Exit early - subscription will be handled by subscription events
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Get product information for enhanced tracking
  const price = subscription.items.data[0].price;
  const product = await stripe.products.retrieve(price.product as string);
  
  // Determine product type based on price interval
  const productType = price.recurring?.interval === 'year' ? 'annual' : 'monthly';
  const productName = `${product.name} (${productType})`;

  const userRef = firestore.collection('users').doc(userId);
  
  // Get current early bird count if this is an early bird
  let earlyBirdNumber: number | undefined;
  if (isEarlyBird) {
    const configRef = firestore.collection('config').doc('earlyBird');
    const configSnap = await configRef.get();
    
    if (configSnap.exists) {
      const currentCount = configSnap.data()?.count || 0;
      earlyBirdNumber = currentCount + 1;
      
      await configRef.update({
        count: earlyBirdNumber,
        isActive: earlyBirdNumber < 50,
      });
    } else {
      earlyBirdNumber = 1;
      await configRef.set({
        count: 1,
        isActive: true,
        maxCount: 50,
      });
    }
  }

  // Check if user document exists
  const userDoc = await userRef.get();
  const currentData = userDoc.exists ? userDoc.data() : {};
  
  // Build user data with enhanced tracking
  const userData: any = {
    subscriptionTier: 'pro',
    subscriptionStatus: subscription.status,
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: price.id,
    stripeProductId: product.id, // NEW: Track product ID
    productName: productName, // NEW: Human-readable product name
    productType: productType, // NEW: Billing frequency
    isEarlyBird: isEarlyBird,
    ...(earlyBirdNumber && { earlyBirdNumber }),
    subscriptionStartDate: new Date().toISOString(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
    lastWebhookEvent: 'checkout.session.completed', // NEW: Track webhook event
    webhookSignature: session.id, // NEW: Track webhook source
    updatedAt: new Date().toISOString(),
  };

  // Add timestamp fields if they exist
  if (subscription.current_period_start) {
    userData.currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
  }
  
  if (subscription.current_period_end) {
    userData.currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  }

  // Create audit trail entry
  const auditEntry = {
    timestamp: new Date(),
    event: 'checkout.session.completed',
    from: currentData,
    to: userData,
    source: 'webhook' as const,
    webhookId: session.id,
  };

  // Add to subscription history
  const existingHistory = currentData.subscriptionHistory || [];
  userData.subscriptionHistory = [...existingHistory, auditEntry].slice(-50); // Keep last 50 changes

  if (!userDoc.exists) {
    userData.createdAt = new Date().toISOString();
    await userRef.set(userData);
  } else {
    await userRef.update(userData);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, stripe: Stripe, firestore: any) {
  const userId = subscription.metadata?.firebaseUID;
  const isEarlyBird = subscription.metadata?.isEarlyBird === 'true';

  if (!userId) {
    return; // Exit silently if no userId in metadata
  }

  // Get product information for enhanced tracking
  const price = subscription.items.data[0].price;
  const product = await stripe.products.retrieve(price.product as string);
  
  // Determine product type based on price interval
  const productType = price.recurring?.interval === 'year' ? 'annual' : 'monthly';
  const productName = `${product.name} (${productType})`;

  const userRef = firestore.collection('users').doc(userId);
  
  // Get current early bird count if this is an early bird
  let earlyBirdNumber: number | undefined;
  if (isEarlyBird) {
    const configRef = firestore.collection('config').doc('earlyBird');
    const configSnap = await configRef.get();
    
    if (configSnap.exists) {
      const currentCount = configSnap.data()?.count || 0;
      earlyBirdNumber = currentCount + 1;
      
      await configRef.update({
        count: earlyBirdNumber,
        isActive: earlyBirdNumber < 50,
      });
    } else {
      earlyBirdNumber = 1;
      await configRef.set({
        count: 1,
        isActive: true,
        maxCount: 50,
      });
    }
  }

  // Check if user document exists
  const userDoc = await userRef.get();
  const currentData = userDoc.exists ? userDoc.data() : {};
  
  // Build user data with enhanced tracking
  const userData: any = {
    subscriptionTier: 'pro',
    subscriptionStatus: subscription.status,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: price.id,
    stripeProductId: product.id,
    productName: productName,
    productType: productType,
    isEarlyBird: isEarlyBird,
    ...(earlyBirdNumber && { earlyBirdNumber }),
    subscriptionStartDate: new Date().toISOString(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
    lastWebhookEvent: 'customer.subscription.created',
    webhookSignature: subscription.id,
    updatedAt: new Date().toISOString(),
  };

  // Add timestamp fields if they exist
  if (subscription.current_period_start) {
    userData.currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
  }
  
  if (subscription.current_period_end) {
    userData.currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  }

  if (!userDoc.exists) {
    userData.createdAt = new Date().toISOString();
    await userRef.set(userData);
  } else {
    await userRef.update(userData);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, firestore: any) {
  const userId = subscription.metadata?.firebaseUID;

  if (!userId) {
    return;
  }

  const userRef = firestore.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const updateData: any = {
      subscriptionStatus: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      updatedAt: new Date().toISOString(),
    };

    if (subscription.current_period_start) {
      updateData.currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
    }
    
    if (subscription.current_period_end) {
      updateData.currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    }

    await userRef.update(updateData);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, firestore: any) {
  const userId = subscription.metadata?.firebaseUID;

  if (!userId) {
    return;
  }

  const userRef = firestore.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({
      subscriptionTier: 'free',
      subscriptionStatus: 'expired',
      cancelAtPeriodEnd: false,
      updatedAt: new Date().toISOString(),
    });
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, stripe: Stripe, firestore: any) {
  if (!invoice.subscription) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );
  const userId = subscription.metadata?.firebaseUID;

  if (!userId) {
    return;
  }

  const userRef = firestore.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({
      subscriptionStatus: 'active',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice, stripe: Stripe, firestore: any) {
  if (!invoice.subscription) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );
  const userId = subscription.metadata?.firebaseUID;

  if (!userId) {
    return;
  }

  const userRef = firestore.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({
      subscriptionStatus: 'past_due',
      updatedAt: new Date().toISOString(),
    });
  }
}
