import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    // During build time, this is okay - it will fail at runtime if actually called
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.warn('STRIPE_SECRET_KEY not set during build - this is normal');
      // Return a dummy instance that will throw if used
      return null as any;
    }
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
  });
}

export const stripe = getStripe();

/**
 * Stripe Price IDs
 * Update these after creating products in Stripe Dashboard
 */
export const STRIPE_PRICES = {
  // Early Bird Pricing (First 50 users)
  EARLY_BIRD_MONTHLY: process.env.STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID || 'price_early_monthly',
  EARLY_BIRD_ANNUAL: process.env.STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID || 'price_early_annual',
  
  // Regular Pricing
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  PRO_ANNUAL: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',
} as const;

