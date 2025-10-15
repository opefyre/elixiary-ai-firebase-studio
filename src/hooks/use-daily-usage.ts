'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

interface DailyUsage {
  date: string;
  recipesGenerated: number;
  recipesSaved: number;
  lastUpdated: Date;
}

interface DailyUsageData {
  usageData: DailyUsage[];
  totalGenerated: number;
  totalSaved: number;
}

export function useDailyUsage(days: number = 7) {
  const { user } = useUser();
  const [data, setData] = useState<DailyUsageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setData(null);
      return;
    }

    const fetchUsageData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/usage/daily?userId=${user.uid}&days=${days}`);
        const result = await response.json();
        
        if (response.ok) {
          setData(result);
        } else {
          setError(result.error || 'Failed to fetch usage data');
        }
      } catch (err) {
        setError('Failed to fetch usage data');
        console.error('Error fetching daily usage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [user, days]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      if (user) {
        const fetchUsageData = async () => {
          setLoading(true);
          setError(null);
          
          try {
            const response = await fetch(`/api/usage/daily?userId=${user.uid}&days=${days}`);
            const result = await response.json();
            
            if (response.ok) {
              setData(result);
            } else {
              setError(result.error || 'Failed to fetch usage data');
            }
          } catch (err) {
            setError('Failed to fetch usage data');
            console.error('Error fetching daily usage:', err);
          } finally {
            setLoading(false);
          }
        };
        
        fetchUsageData();
      }
    }
  };
}
