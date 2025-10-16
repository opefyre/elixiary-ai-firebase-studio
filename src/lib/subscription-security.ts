/**
 * Subscription Security & Validation Utilities
 */

import { UserSubscription } from '@/types/subscription';

/**
 * Validate that a subscription change is legitimate
 */
export function validateSubscriptionChange(
  currentSubscription: UserSubscription | null,
  newSubscription: Partial<UserSubscription>,
  source: 'webhook' | 'manual' | 'system'
): { isValid: boolean; reason?: string } {
  
  // If no current subscription, any new subscription is valid
  if (!currentSubscription) {
    return { isValid: true };
  }

  // Check for suspicious changes
  if (source === 'manual') {
    // Manual changes should be limited
    const allowedManualChanges = [
      'subscriptionStatus',
      'cancelAtPeriodEnd',
      'updatedAt'
    ];
    
    const changedFields = Object.keys(newSubscription).filter(
      key => currentSubscription[key as keyof UserSubscription] !== newSubscription[key as keyof UserSubscription]
    );
    
    const suspiciousChanges = changedFields.filter(field => !allowedManualChanges.includes(field));
    
    if (suspiciousChanges.length > 0) {
      return {
        isValid: false,
        reason: `Suspicious manual changes detected: ${suspiciousChanges.join(', ')}`
      };
    }
  }

  // Check for downgrade without proper cancellation
  if (currentSubscription.subscriptionTier === 'pro' && newSubscription.subscriptionTier === 'free') {
    if (currentSubscription.subscriptionStatus === 'active' && newSubscription.subscriptionStatus !== 'canceled') {
      return {
        isValid: false,
        reason: 'Cannot downgrade from Pro to Free without proper cancellation'
      };
    }
  }

  // Check for product changes without webhook
  if (source !== 'webhook' && newSubscription.stripeProductId && 
      newSubscription.stripeProductId !== currentSubscription.stripeProductId) {
    return {
      isValid: false,
      reason: 'Product changes must come from Stripe webhooks'
    };
  }

  return { isValid: true };
}

/**
 * Create an audit entry for subscription changes
 */
export function createAuditEntry(
  event: string,
  from: Partial<UserSubscription>,
  to: Partial<UserSubscription>,
  source: 'webhook' | 'manual' | 'system',
  webhookId?: string
) {
  return {
    timestamp: new Date(),
    event,
    from,
    to,
    source,
    webhookId,
  };
}

/**
 * Validate webhook signature and event
 */
export function validateWebhookEvent(
  eventType: string,
  eventId: string,
  lastProcessedEvent?: string
): { isValid: boolean; reason?: string } {
  
  // Check for duplicate events
  if (lastProcessedEvent === eventId) {
    return {
      isValid: false,
      reason: 'Duplicate webhook event'
    };
  }

  // Check for valid event types
  const validEventTypes = [
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed'
  ];

  if (!validEventTypes.includes(eventType)) {
    return {
      isValid: false,
      reason: `Invalid event type: ${eventType}`
    };
  }

  return { isValid: true };
}

/**
 * Get product information from Stripe data
 */
export function extractProductInfo(price: any, product: any) {
  const productType = price.recurring?.interval === 'year' ? 'annual' : 'monthly';
  const productName = `${product.name} (${productType})`;
  
  return {
    stripeProductId: product.id,
    productName,
    productType,
    stripePriceId: price.id,
  };
}
