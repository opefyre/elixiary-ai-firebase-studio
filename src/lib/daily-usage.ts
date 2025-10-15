import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

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
 * Track a recipe generation for today
 */
export async function trackRecipeGeneration(userId: string, firestore: any) {
  const today = getTodayString();
  const usageRef = doc(firestore, `users/${userId}/dailyUsage/${today}`);
  
  try {
    const docSnap = await getDoc(usageRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(usageRef, {
        recipesGenerated: increment(1),
        lastUpdated: serverTimestamp(),
      });
    } else {
      // Create new document for today
      await setDoc(usageRef, {
        date: today,
        recipesGenerated: 1,
        recipesSaved: 0,
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error tracking recipe generation:', error);
    throw error;
  }
}

/**
 * Track a recipe save for today
 */
export async function trackRecipeSave(userId: string, firestore: any) {
  const today = getTodayString();
  const usageRef = doc(firestore, `users/${userId}/dailyUsage/${today}`);
  
  try {
    const docSnap = await getDoc(usageRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(usageRef, {
        recipesSaved: increment(1),
        lastUpdated: serverTimestamp(),
      });
    } else {
      // Create new document for today
      await setDoc(usageRef, {
        date: today,
        recipesGenerated: 0,
        recipesSaved: 1,
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error tracking recipe save:', error);
    throw error;
  }
}

/**
 * Track a recipe unsave for today
 */
export async function trackRecipeUnsave(userId: string, firestore: any) {
  const today = getTodayString();
  const usageRef = doc(firestore, `users/${userId}/dailyUsage/${today}`);
  
  try {
    const docSnap = await getDoc(usageRef);
    
    if (docSnap.exists()) {
      // Update existing document (decrement, but don't go below 0)
      const currentData = docSnap.data();
      const newCount = Math.max(0, (currentData.recipesSaved || 0) - 1);
      
      await updateDoc(usageRef, {
        recipesSaved: newCount,
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error tracking recipe unsave:', error);
    throw error;
  }
}

/**
 * Get daily usage data for the last N days
 */
export async function getDailyUsageData(userId: string, firestore: any, days: number = 7): Promise<DailyUsage[]> {
  const usageData: DailyUsage[] = [];
  
  // Generate last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      const usageRef = doc(firestore, `users/${userId}/dailyUsage/${dateStr}`);
      const docSnap = await getDoc(usageRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        usageData.push({
          date: dateStr,
          recipesGenerated: data.recipesGenerated || 0,
          recipesSaved: data.recipesSaved || 0,
          lastUpdated: data.lastUpdated?.toDate() || new Date(),
        });
      } else {
        // No data for this day
        usageData.push({
          date: dateStr,
          recipesGenerated: 0,
          recipesSaved: 0,
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      console.error(`Error fetching usage data for ${dateStr}:`, error);
      // Add empty data for this day
      usageData.push({
        date: dateStr,
        recipesGenerated: 0,
        recipesSaved: 0,
        lastUpdated: new Date(),
      });
    }
  }
  
  return usageData;
}
