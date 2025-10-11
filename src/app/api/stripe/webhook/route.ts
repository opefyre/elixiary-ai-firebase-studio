import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  // Initialize at runtime
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });

  const { firestore } = initializeFirebase();
  
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
    switch (event.type) {
      case 'checkout.session.completed': {
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
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
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
    console.error('No firebaseUID in session metadata');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const userRef = doc(firestore, 'users', userId);
  
  // Get current early bird count if this is an early bird
  let earlyBirdNumber: number | undefined;
  if (isEarlyBird) {
    const configRef = doc(firestore, 'config', 'earlyBird');
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      const currentCount = configSnap.data().count || 0;
      earlyBirdNumber = currentCount + 1;
      
      // Increment early bird counter
      await updateDoc(configRef, {
        count: earlyBirdNumber,
        isActive: earlyBirdNumber < 50,
      });
    } else {
      // Initialize early bird config
      earlyBirdNumber = 1;
      await setDoc(configRef, {
        count: 1,
        isActive: true,
        maxCount: 50,
      });
    }
  }

  await updateDoc(userRef, {
    subscriptionTier: 'pro',
    subscriptionStatus: subscription.status,
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0].price.id,
    isEarlyBird: isEarlyBird,
    ...(earlyBirdNumber && { earlyBirdNumber }),
    subscriptionStartDate: serverTimestamp(),
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: serverTimestamp(),
  });

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

  const userRef = doc(firestore, 'users', userId);

  await updateDoc(userRef, {
    subscriptionStatus: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: serverTimestamp(),
  });

  console.log(`Subscription updated for user: ${userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, firestore: any) {
  const userId = subscription.metadata?.firebaseUID;

  if (!userId) {
    console.error('No firebaseUID in subscription metadata');
    return;
  }

  const userRef = doc(firestore, 'users', userId);

  await updateDoc(userRef, {
    subscriptionTier: 'free',
    subscriptionStatus: 'expired',
    cancelAtPeriodEnd: false,
    updatedAt: serverTimestamp(),
  });

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

  const userRef = doc(firestore, 'users', userId);

  await updateDoc(userRef, {
    subscriptionStatus: 'active',
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    updatedAt: serverTimestamp(),
  });

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

  const userRef = doc(firestore, 'users', userId);

  await updateDoc(userRef, {
    subscriptionStatus: 'past_due',
    updatedAt: serverTimestamp(),
  });

  console.log(`Payment failed for user: ${userId}`);
}

