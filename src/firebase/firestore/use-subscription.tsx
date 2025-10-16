'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase, useUser } from '@/firebase';
import { 
  UserSubscription, 
  SubscriptionTier, 
  getLimitsForTier,
  UsageLimits 
} from '@/types/subscription';

export function useSubscription() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    const userDocRef = doc(firestore, 'users', user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          
          // Helper function to convert timestamp (Firestore Timestamp or ISO string) to Date
          const toDate = (timestamp: any): Date | null => {
            if (!timestamp) return null;
            if (typeof timestamp === 'string') {
              return new Date(timestamp);
            }
            if (timestamp.toDate && typeof timestamp.toDate === 'function') {
              return timestamp.toDate();
            }
            return null;
          };

          
          // Convert Firestore timestamps to Date objects
          const subscriptionData: UserSubscription = {
            subscriptionTier: data.subscriptionTier || 'free',
            subscriptionStatus: data.subscriptionStatus || 'active',
            stripeCustomerId: data.stripeCustomerId,
            stripeSubscriptionId: data.stripeSubscriptionId,
            stripePriceId: data.stripePriceId,
            isEarlyBird: data.isEarlyBird || false,
            earlyBirdNumber: data.earlyBirdNumber,
            subscriptionStartDate: toDate(data.subscriptionStartDate),
            currentPeriodStart: toDate(data.currentPeriodStart),
            currentPeriodEnd: toDate(data.currentPeriodEnd),
            cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
            recipesGeneratedThisMonth: data.recipesGeneratedThisMonth || 0,
            lastGenerationResetDate: toDate(data.lastGenerationResetDate) || new Date(),
            totalRecipesGenerated: data.totalRecipesGenerated || 0,
            recipeCount: data.recipeCount || 0,
            createdAt: toDate(data.createdAt) || new Date(),
            updatedAt: toDate(data.updatedAt),
          };
          
          
          setSubscription(subscriptionData);
        } else {
          // Initialize user document with default values
          const now = new Date();
          const initialData: Partial<UserSubscription> = {
            subscriptionTier: 'free',
            subscriptionStatus: 'active',
            isEarlyBird: false,
            cancelAtPeriodEnd: false,
            recipesGeneratedThisMonth: 0,
            lastGenerationResetDate: now,
            totalRecipesGenerated: 0,
            recipeCount: 0,
            createdAt: now,
          };
          
          await setDoc(userDocRef, {
            ...initialData,
            createdAt: serverTimestamp(),
            lastGenerationResetDate: serverTimestamp(),
          });
        }
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, firestore]);

  // Check if user needs monthly reset
  useEffect(() => {
    if (!subscription || !user || !firestore) return;

    const now = new Date();
    const lastReset = subscription.lastGenerationResetDate;
    
    
    // Check if we're in a new month
    const needsReset = 
      lastReset.getMonth() !== now.getMonth() || 
      lastReset.getFullYear() !== now.getFullYear();

    if (needsReset && subscription.subscriptionTier === 'free') {
      // Reset counter for free users
      const userDocRef = doc(firestore, 'users', user.uid);
      updateDoc(userDocRef, {
        recipesGeneratedThisMonth: 0,
        lastGenerationResetDate: serverTimestamp(),
      }).catch(() => {
        // Silent error handling for reset
      });
    }
  }, [subscription, user, firestore]);

  const limits: UsageLimits = subscription 
    ? getLimitsForTier(subscription.subscriptionTier)
    : getLimitsForTier('free');

  const canGenerateRecipe = subscription 
    ? subscription.subscriptionTier === 'pro' || 
      subscription.recipesGeneratedThisMonth < limits.generationsPerMonth
    : false;

  const canSaveRecipe = subscription
    ? subscription.subscriptionTier === 'pro' || 
      subscription.recipeCount < limits.maxSavedRecipes
    : false;

  const remainingGenerations = subscription && subscription.subscriptionTier === 'free'
    ? Math.max(0, limits.generationsPerMonth - subscription.recipesGeneratedThisMonth)
    : Infinity;

  const remainingSaves = subscription && subscription.subscriptionTier === 'free'
    ? Math.max(0, limits.maxSavedRecipes - subscription.recipeCount)
    : Infinity;

  // Get next reset date (1st of next month)
  const getNextResetDate = (): Date => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
  };

  const isPro = subscription?.subscriptionTier === 'pro';

  return {
    subscription,
    isLoading,
    isPro,
    limits,
    canGenerateRecipe,
    canSaveRecipe,
    remainingGenerations,
    remainingSaves,
    nextResetDate: getNextResetDate(),
  };
}

/**
 * Increment recipe generation counter
 * Should be called after successful recipe generation
 */
export async function incrementGenerationCount(userId: string, firestore: any) {
  const userDocRef = doc(firestore, 'users', userId);
  
  try {
    await updateDoc(userDocRef, {
      recipesGeneratedThisMonth: (await import('firebase/firestore')).increment(1),
      totalRecipesGenerated: (await import('firebase/firestore')).increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Update recipe count (saved recipes)
 * Should be called after save/delete operations
 */
export async function updateRecipeCount(userId: string, firestore: any, delta: number) {
  const userDocRef = doc(firestore, 'users', userId);
  
  try {
    await updateDoc(userDocRef, {
      recipeCount: (await import('firebase/firestore')).increment(delta),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
}

