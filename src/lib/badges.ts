import { 
  Badge, 
  UserBadges, 
  BadgeProgress, 
  BADGE_DEFINITIONS,
  getBadgeById 
} from '@/types/badges';

/**
 * Check if a user has earned any new badges based on their current achievements
 */
export function checkForNewBadges(
  currentBadges: string[],
  achievements: UserBadges['achievements'],
  isEarlyBird: boolean = false
): string[] {
  const newBadgeIds: string[] = [];

  // Check generation badges
  const generationBadges = BADGE_DEFINITIONS.filter(b => b.category === 'generation');
  for (const badge of generationBadges) {
    if (!currentBadges.includes(badge.id) && achievements.recipesGenerated >= badge.requirement) {
      newBadgeIds.push(badge.id);
    }
  }

  // Check collection badges
  const collectionBadges = BADGE_DEFINITIONS.filter(b => b.category === 'collection');
  for (const badge of collectionBadges) {
    if (!currentBadges.includes(badge.id) && achievements.recipesSaved >= badge.requirement) {
      newBadgeIds.push(badge.id);
    }
  }

  // Check special achievement badges
  const achievementBadges = BADGE_DEFINITIONS.filter(b => b.category === 'achievement');
  for (const badge of achievementBadges) {
    if (!currentBadges.includes(badge.id)) {
      let shouldUnlock = false;

      switch (badge.id) {
        case 'early_bird':
          shouldUnlock = isEarlyBird;
          break;
        case 'monthly_mixer':
          shouldUnlock = achievements.maxRecipesInMonth >= badge.requirement;
          break;
        case 'dedicated_drinker':
          shouldUnlock = achievements.consecutiveDays >= badge.requirement;
          break;
        case 'explorer':
          shouldUnlock = achievements.categoriesExplored.length >= badge.requirement;
          break;
        case 'perfectionist':
          shouldUnlock = achievements.maxRecipesInDay >= badge.requirement;
          break;
      }

      if (shouldUnlock) {
        newBadgeIds.push(badge.id);
      }
    }
  }

  return newBadgeIds;
}

/**
 * Calculate progress for all badges
 */
export function calculateBadgeProgress(
  currentBadges: string[],
  achievements: UserBadges['achievements']
): BadgeProgress[] {
  return BADGE_DEFINITIONS.map(badge => {
    const isUnlocked = currentBadges.includes(badge.id);
    let current = 0;

    switch (badge.category) {
      case 'generation':
        current = achievements.recipesGenerated;
        break;
      case 'collection':
        current = achievements.recipesSaved;
        break;
      case 'achievement':
        switch (badge.id) {
          case 'early_bird':
            current = 1; // This is handled separately
            break;
          case 'monthly_mixer':
            current = achievements.maxRecipesInMonth;
            break;
          case 'dedicated_drinker':
            current = achievements.consecutiveDays;
            break;
          case 'explorer':
            current = achievements.categoriesExplored.length;
            break;
          case 'perfectionist':
            current = achievements.maxRecipesInDay;
            break;
        }
        break;
    }

    const progress = Math.min((current / badge.requirement) * 100, 100);

    return {
      badge,
      current,
      required: badge.requirement,
      progress,
      isUnlocked,
    };
  });
}

/**
 * Update achievements based on user actions
 */
export function updateAchievements(
  currentAchievements: UserBadges['achievements'],
  action: 'recipe_generated' | 'recipe_saved' | 'category_explored',
  data?: { category?: string; date?: Date }
): UserBadges['achievements'] {
  const now = new Date();
  const today = now.toDateString();
  const lastActivityDate = currentAchievements.lastActivityDate;
  const lastActivityDay = lastActivityDate ? lastActivityDate.toDateString() : null;

  let newAchievements = { ...currentAchievements };

  switch (action) {
    case 'recipe_generated':
      newAchievements.recipesGenerated += 1;
      
      // Update max recipes in day
      if (lastActivityDay === today) {
        // Same day - increment daily count
        const dailyCount = (newAchievements as any).dailyGeneratedCount || 0;
        (newAchievements as any).dailyGeneratedCount = dailyCount + 1;
        newAchievements.maxRecipesInDay = Math.max(newAchievements.maxRecipesInDay, dailyCount + 1);
      } else {
        // New day - reset daily count
        (newAchievements as any).dailyGeneratedCount = 1;
        newAchievements.maxRecipesInDay = Math.max(newAchievements.maxRecipesInDay, 1);
      }

      // Update consecutive days
      if (lastActivityDay === today) {
        // Same day - no change to consecutive days
      } else if (lastActivityDay === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
        // Previous day - increment consecutive days
        newAchievements.consecutiveDays += 1;
      } else {
        // Gap in days - reset consecutive days
        newAchievements.consecutiveDays = 1;
      }

      newAchievements.lastActivityDate = now;
      break;

    case 'recipe_saved':
      newAchievements.recipesSaved += 1;
      newAchievements.lastActivityDate = now;
      break;

    case 'category_explored':
      if (data?.category && !newAchievements.categoriesExplored.includes(data.category)) {
        newAchievements.categoriesExplored.push(data.category);
      }
      break;
  }

  return newAchievements;
}

/**
 * Get badge statistics for display
 */
export function getBadgeStats(userBadges: UserBadges) {
  const totalBadges = BADGE_DEFINITIONS.length;
  const unlockedBadges = userBadges.badges.length;
  const progress = calculateBadgeProgress(userBadges.badges, userBadges.achievements);
  
  const byTier = {
    bronze: progress.filter(p => p.badge.tier === 'bronze' && p.isUnlocked).length,
    silver: progress.filter(p => p.badge.tier === 'silver' && p.isUnlocked).length,
    gold: progress.filter(p => p.badge.tier === 'gold' && p.isUnlocked).length,
    platinum: progress.filter(p => p.badge.tier === 'platinum' && p.isUnlocked).length,
    diamond: progress.filter(p => p.badge.tier === 'diamond' && p.isUnlocked).length,
  };

  const byCategory = {
    generation: progress.filter(p => p.badge.category === 'generation' && p.isUnlocked).length,
    collection: progress.filter(p => p.badge.category === 'collection' && p.isUnlocked).length,
    achievement: progress.filter(p => p.badge.category === 'achievement' && p.isUnlocked).length,
  };

  return {
    totalBadges,
    unlockedBadges,
    completionPercentage: Math.round((unlockedBadges / totalBadges) * 100),
    byTier,
    byCategory,
    progress,
  };
}

/**
 * Get the next badge to work towards
 */
export function getNextBadge(progress: BadgeProgress[]): BadgeProgress | null {
  const unlocked = progress.filter(p => p.isUnlocked);
  const locked = progress.filter(p => !p.isUnlocked);
  
  if (locked.length === 0) return null;

  // Sort by progress percentage (highest first)
  const sortedLocked = locked.sort((a, b) => b.progress - a.progress);
  
  return sortedLocked[0];
}
