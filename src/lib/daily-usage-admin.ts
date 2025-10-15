import { adminDb } from '@/firebase/server';

export interface DailyUsage {
  date: string; // YYYY-MM-DD format
  recipesGenerated: number;
  recipesSaved: number;
  lastUpdated: Date;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Track a recipe generation for today (Admin SDK version)
 */
export async function trackRecipeGeneration(userId: string) {
  const { adminDb } = await import('@/firebase/server');
  const today = getTodayString();
  const usageRef = adminDb.collection(`users/${userId}/dailyUsage`).doc(today);
  
  try {
    const docSnap = await usageRef.get();
    
    if (docSnap.exists) {
      // Update existing document
      await usageRef.update({
        recipesGenerated: adminDb.FieldValue.increment(1),
        lastUpdated: adminDb.FieldValue.serverTimestamp(),
      });
    } else {
      // Create new document for today
      await usageRef.set({
        date: today,
        recipesGenerated: 1,
        recipesSaved: 0,
        lastUpdated: adminDb.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error tracking recipe generation:', error);
    throw error;
  }
}

/**
 * Track a recipe save for today (Admin SDK version)
 */
export async function trackRecipeSave(userId: string) {
  const { adminDb } = await import('@/firebase/server');
  const today = getTodayString();
  const usageRef = adminDb.collection(`users/${userId}/dailyUsage`).doc(today);
  
  try {
    const docSnap = await usageRef.get();
    
    if (docSnap.exists) {
      // Update existing document
      await usageRef.update({
        recipesSaved: adminDb.FieldValue.increment(1),
        lastUpdated: adminDb.FieldValue.serverTimestamp(),
      });
    } else {
      // Create new document for today
      await usageRef.set({
        date: today,
        recipesGenerated: 0,
        recipesSaved: 1,
        lastUpdated: adminDb.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error tracking recipe save:', error);
    throw error;
  }
}

/**
 * Track a recipe unsave for today (Admin SDK version)
 */
export async function trackRecipeUnsave(userId: string) {
  const { adminDb } = await import('@/firebase/server');
  const today = getTodayString();
  const usageRef = adminDb.collection(`users/${userId}/dailyUsage`).doc(today);
  
  try {
    const docSnap = await usageRef.get();
    
    if (docSnap.exists) {
      // Update existing document (decrement, but don't go below 0)
      const currentData = docSnap.data();
      const newCount = Math.max(0, (currentData?.recipesSaved || 0) - 1);
      
      await usageRef.update({
        recipesSaved: newCount,
        lastUpdated: adminDb.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error tracking recipe unsave:', error);
    throw error;
  }
}
