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
  
  // Early Bird Tracking
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
  
  // Metadata
  createdAt: Date;
  updatedAt?: Date;
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

