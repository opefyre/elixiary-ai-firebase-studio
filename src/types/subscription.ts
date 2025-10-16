/**
 * Subscription Types for Elixiary AI
 */

export type SubscriptionTier = 'free' | 'pro';

export type SubscriptionStatus = 
  | 'active'       // Subscription is active
  | 'trialing'     // In trial period (not used initially)
  | 'past_due'     // Payment failed, grace period
  | 'canceled'     // Canceled but still has access until period end
  | 'incomplete'   // Payment incomplete
  | 'expired';     // Subscription ended

export interface UserSubscription {
  // Tier & Status
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  
  // Stripe IDs
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeProductId?: string; // NEW: Track which product user subscribed to
  
  // Product Information
  productName?: string; // NEW: Human-readable product name
  productType?: 'monthly' | 'annual'; // NEW: Billing frequency
  
  // Early Bird Tracking (DEPRECATED - remove in future)
  isEarlyBird: boolean;
  earlyBirdNumber?: number; // 1-50
  
  // Subscription Dates
  subscriptionStartDate?: Date | null;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd: boolean;
  
  // Usage Tracking
  recipesGeneratedThisMonth: number;
  lastGenerationResetDate: Date;
  totalRecipesGenerated: number;
  recipeCount: number; // Number of saved recipes
  
  // Security & Audit
  lastWebhookEvent?: string; // NEW: Last webhook event processed
  webhookSignature?: string; // NEW: Last webhook signature
  subscriptionHistory?: SubscriptionChange[]; // NEW: Audit trail
  
  // Metadata
  createdAt: Date;
  updatedAt?: Date;
}

export interface SubscriptionChange {
  timestamp: Date;
  event: string;
  from: Partial<UserSubscription>;
  to: Partial<UserSubscription>;
  source: 'webhook' | 'manual' | 'system';
  webhookId?: string;
}

export interface UsageLimits {
  generationsPerMonth: number;
  maxSavedRecipes: number;
  canGenerateImages: boolean;
  canExportPDF: boolean;
  canUseAdvancedCustomization: boolean;
  canUseShoppingList: boolean;
}

export const FREE_TIER_LIMITS: UsageLimits = {
  generationsPerMonth: 10,
  maxSavedRecipes: 20,
  canGenerateImages: false,
  canExportPDF: false,
  canUseAdvancedCustomization: false,
  canUseShoppingList: false,
};

export const PRO_TIER_LIMITS: UsageLimits = {
  generationsPerMonth: Infinity,
  maxSavedRecipes: Infinity,
  canGenerateImages: true,
  canExportPDF: true,
  canUseAdvancedCustomization: true,
  canUseShoppingList: true,
};

export function getLimitsForTier(tier: SubscriptionTier): UsageLimits {
  return tier === 'pro' ? PRO_TIER_LIMITS : FREE_TIER_LIMITS;
}

export interface EarlyBirdConfig {
  count: number; // 0-50
  isActive: boolean;
  maxCount: number; // 50
}

