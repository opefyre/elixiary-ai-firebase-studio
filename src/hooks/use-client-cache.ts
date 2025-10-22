import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface UseCacheOptions {
  ttl?: number; // Time to live in milliseconds
  enabled?: boolean; // Whether caching is enabled
}

/**
 * Client-side caching hook for API responses
 * Reduces redundant API calls by caching responses in memory
 */
export function useClientCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCacheOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
} {
  const { ttl = 5 * 60 * 1000, enabled = true } = options; // Default 5 minutes
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // In-memory cache
  const cache = new Map<string, CacheEntry<T>>();

  const isExpired = (entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp > entry.ttl;
  };

  const getCachedData = useCallback((): T | null => {
    if (!enabled) return null;
    
    const entry = cache.get(key);
    if (!entry || isExpired(entry)) {
      cache.delete(key);
      return null;
    }
    
    return entry.data;
  }, [key, enabled]);

  const setCachedData = useCallback((newData: T): void => {
    if (!enabled) return;
    
    cache.set(key, {
      data: newData,
      timestamp: Date.now(),
      ttl
    });
  }, [key, ttl, enabled]);

  const fetchData = useCallback(async (): Promise<void> => {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setCachedData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [fetcher, getCachedData, setCachedData]);

  const refetch = useCallback(async (): Promise<void> => {
    // Clear cache and fetch fresh data
    cache.delete(key);
    await fetchData();
  }, [key, fetchData]);

  const clearCache = useCallback((): void => {
    cache.delete(key);
    setData(null);
  }, [key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
}

/**
 * Hook for caching recipe data specifically
 */
export function useRecipeCache(
  params: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    search?: string;
    tags?: string[];
  },
  fetcher: () => Promise<any>
) {
  const cacheKey = `recipes:${JSON.stringify(params)}`;
  
  return useClientCache(cacheKey, fetcher, {
    ttl: 5 * 60 * 1000, // 5 minutes
    enabled: true
  });
}

/**
 * Hook for caching user-specific data
 */
export function useUserCache<T>(
  userId: string,
  dataType: string,
  fetcher: () => Promise<T>
) {
  const cacheKey = `user:${userId}:${dataType}`;
  
  return useClientCache(cacheKey, fetcher, {
    ttl: 2 * 60 * 1000, // 2 minutes for user data
    enabled: true
  });
}

/**
 * Global cache manager for manual cache control
 */
export class ClientCacheManager {
  private static cache = new Map<string, CacheEntry<any>>();

  static set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  static getStats(): {
    size: number;
    keys: string[];
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  ClientCacheManager.cleanup();
}, 5 * 60 * 1000);
