'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirebase } from '@/firebase';
import { UserBadges, BadgeProgress } from '@/types/badges';
import { getBadgeStats } from '@/lib/badges';
import { authenticatedFetch } from '@/lib/firebase-token-manager';

interface BadgeStats {
  totalBadges: number;
  unlockedBadges: number;
  completionPercentage: number;
  byTier: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    diamond: number;
  };
  byCategory: {
    generation: number;
    collection: number;
    achievement: number;
  };
  progress: BadgeProgress[];
}

interface UseBadgesResult {
  userBadges: UserBadges | null;
  stats: BadgeStats | null;
  progress: BadgeProgress[];
  loading: boolean;
  error: string | null;
  refreshBadges: () => Promise<void>;
  updateBadges: (action: 'recipe_generated' | 'recipe_saved' | 'category_explored', data?: any) => Promise<string[]>;
}

export function useBadges(): UseBadgesResult {
  const { user } = useUser();
  const { auth } = useFirebase();
  const [userBadges, setUserBadges] = useState<UserBadges | null>(null);
  const [stats, setStats] = useState<BadgeStats | null>(null);
  const [progress, setProgress] = useState<BadgeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = useCallback(async () => {
    if (!user || !auth) {
      setUserBadges(null);
      setStats(null);
      setProgress([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(user, '/api/badges');
      
      if (response.ok) {
        const data = await response.json();
        setUserBadges(data.userBadges);
        setStats(data.stats);
        setProgress(data.progress);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to fetch badges');
      }
    } catch (err: any) {
      console.error('Error fetching badges:', err);
      setError(err.message || 'Failed to fetch badges');
    } finally {
      setLoading(false);
    }
  }, [user, auth]);

  const updateBadges = useCallback(async (
    action: 'recipe_generated' | 'recipe_saved' | 'category_explored',
    data?: any
  ): Promise<string[]> => {
    if (!user || !auth) {
      throw new Error('User must be authenticated');
    }

    try {
      const response = await authenticatedFetch(user, '/api/badges', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, data }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update local state
        setUserBadges(result.userBadges);
        
        // Recalculate stats and progress
        const newStats = getBadgeStats(result.userBadges);
        setStats(newStats);
        setProgress(newStats.progress);

        return result.newBadges || [];
      } else {
        throw new Error(result.error || 'Failed to update badges');
      }
    } catch (err: any) {
      console.error('Error updating badges:', err);
      throw err;
    }
  }, [user, auth]);

  const refreshBadges = useCallback(async () => {
    await fetchBadges();
  }, [fetchBadges]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return {
    userBadges,
    stats,
    progress,
    loading,
    error,
    refreshBadges,
    updateBadges,
  };
}
