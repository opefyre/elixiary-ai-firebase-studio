export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: 'generation' | 'collection' | 'achievement';
  requirement: number;
  unlockedAt?: Date;
}

export interface UserBadges {
  badges: string[]; // Array of badge IDs
  achievements: {
    recipesGenerated: number;
    recipesSaved: number;
    lastActivityDate: Date | null;
    categoriesExplored: string[];
    consecutiveDays: number;
    maxRecipesInDay: number;
    maxRecipesInMonth: number;
  };
  lastUpdated: Date;
}

export interface BadgeProgress {
  badge: Badge;
  current: number;
  required: number;
  progress: number; // 0-100
  isUnlocked: boolean;
}

// Badge definitions
export const BADGE_DEFINITIONS: Badge[] = [
  // Recipe Generation Badges
  {
    id: 'novice_mixologist',
    name: 'Novice Mixologist',
    description: 'Generated your first 10 cocktail recipes',
    icon: '🍸',
    color: '#cd7f32',
    tier: 'bronze',
    category: 'generation',
    requirement: 10,
  },
  {
    id: 'apprentice_bartender',
    name: 'Apprentice Bartender',
    description: 'Generated 25 cocktail recipes',
    icon: '🥃',
    color: '#c0c0c0',
    tier: 'silver',
    category: 'generation',
    requirement: 25,
  },
  {
    id: 'craft_cocktail_creator',
    name: 'Craft Cocktail Creator',
    description: 'Generated 50 cocktail recipes',
    icon: '🍹',
    color: '#ffd700',
    tier: 'gold',
    category: 'generation',
    requirement: 50,
  },
  {
    id: 'master_mixologist',
    name: 'Master Mixologist',
    description: 'Generated 100 cocktail recipes',
    icon: '🍸',
    color: '#e5e4e2',
    tier: 'platinum',
    category: 'generation',
    requirement: 100,
  },
  {
    id: 'legendary_elixir_master',
    name: 'Legendary Elixir Master',
    description: 'Generated 250+ cocktail recipes',
    icon: '👑',
    color: '#b9f2ff',
    tier: 'diamond',
    category: 'generation',
    requirement: 250,
  },

  // Recipe Collection Badges
  {
    id: 'taste_explorer',
    name: 'Taste Explorer',
    description: 'Saved your first 5 cocktail recipes',
    icon: '⭐',
    color: '#cd7f32',
    tier: 'bronze',
    category: 'collection',
    requirement: 5,
  },
  {
    id: 'flavor_collector',
    name: 'Flavor Collector',
    description: 'Saved 15 cocktail recipes',
    icon: '🌟',
    color: '#c0c0c0',
    tier: 'silver',
    category: 'collection',
    requirement: 15,
  },
  {
    id: 'cocktail_curator',
    name: 'Cocktail Curator',
    description: 'Saved 30 cocktail recipes',
    icon: '💫',
    color: '#ffd700',
    tier: 'gold',
    category: 'collection',
    requirement: 30,
  },
  {
    id: 'recipe_archivist',
    name: 'Recipe Archivist',
    description: 'Saved 50 cocktail recipes',
    icon: '📚',
    color: '#e5e4e2',
    tier: 'platinum',
    category: 'collection',
    requirement: 50,
  },
  {
    id: 'ultimate_connoisseur',
    name: 'Ultimate Connoisseur',
    description: 'Saved 100+ cocktail recipes',
    icon: '🏆',
    color: '#b9f2ff',
    tier: 'diamond',
    category: 'collection',
    requirement: 100,
  },

  // Special Achievement Badges
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Pro member from launch',
    icon: '🐦',
    color: '#ffd700',
    tier: 'gold',
    category: 'achievement',
    requirement: 1,
  },
  {
    id: 'monthly_mixer',
    name: 'Monthly Mixer',
    description: 'Generated 20+ recipes in one month',
    icon: '📅',
    color: '#ffd700',
    tier: 'gold',
    category: 'achievement',
    requirement: 20,
  },
  {
    id: 'dedicated_drinker',
    name: 'Dedicated Drinker',
    description: '7 consecutive days of activity',
    icon: '🔥',
    color: '#ff6b6b',
    tier: 'platinum',
    category: 'achievement',
    requirement: 7,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Saved recipes from 5+ different categories',
    icon: '🗺️',
    color: '#4ecdc4',
    tier: 'gold',
    category: 'achievement',
    requirement: 5,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Generated 10+ recipes in a single day',
    icon: '⚡',
    color: '#ffd93d',
    tier: 'platinum',
    category: 'achievement',
    requirement: 10,
  },
];

export const getBadgeById = (id: string): Badge | undefined => {
  return BADGE_DEFINITIONS.find(badge => badge.id === id);
};

export const getBadgesByCategory = (category: Badge['category']): Badge[] => {
  return BADGE_DEFINITIONS.filter(badge => badge.category === category);
};

export const getBadgesByTier = (tier: Badge['tier']): Badge[] => {
  return BADGE_DEFINITIONS.filter(badge => badge.tier === tier);
};
