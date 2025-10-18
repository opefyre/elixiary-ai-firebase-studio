import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  // Initialize Stripe and Firebase at runtime
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing Stripe configuration');
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
    console.error('Firebase Admin SDK initialization failed:', error.message);
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
    console.log('🔍 Webhook event received:', event.type);
    console.log('🔍 Event ID:', event.id);
    console.log('🔍 Event data:', JSON.stringify(event.data, null, 2));
    
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('🔍 Handling checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, stripe, firestore);
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
    console.error('Error processing webhook:', error.message);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, firestore: any) {
  console.log('🔍 DEBUG: Processing checkout.session.completed');
  console.log('🔍 Session ID:', session.id);
  console.log('🔍 Session metadata:', session.metadata);
  console.log('🔍 Customer ID:', session.customer);
  console.log('🔍 Subscription ID:', session.subscription);
  
  const userId = session.metadata?.firebaseUID;
  const isEarlyBird = session.metadata?.isEarlyBird === 'true';

  console.log('🔍 Extracted userId:', userId);
  console.log('🔍 Extracted isEarlyBird:', isEarlyBird);

  if (!userId) {
    console.error('❌ No firebaseUID in session metadata');
    console.error('❌ Available metadata keys:', Object.keys(session.metadata || {}));
    throw new Error('No firebaseUID in session metadata');
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

  console.log('🔍 About to update user:', userId);
  console.log('🔍 User data to set/update:', userData);

  if (!userDoc.exists) {
    console.log('🔍 Creating new user document');
    userData.createdAt = new Date().toISOString();
    await userRef.set(userData);
    console.log('✅ User document created successfully');
  } else {
    console.log('🔍 Updating existing user document');
    console.log('🔍 Current user data:', currentData);
    await userRef.update(userData);
    console.log('✅ User document updated successfully');
  }
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
    console.error('No firebaseUID in subscription metadata');
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
    console.error('No firebaseUID in subscription metadata');
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
