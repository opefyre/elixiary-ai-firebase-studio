/**
 * In-Memory Cache Manager for Vercel Serverless Architecture
 * 
 * This implementation uses only in-memory caching, which is perfect for:
 * - Vercel serverless functions
 * - Firebase + GitHub architecture
 * - No additional Redis hosting costs
 * - Automatic cleanup on function cold starts
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.DEFAULT_TTL;
    const expires = Date.now() + ttl;
    this.cache.set(key, { data: value, timestamp: Date.now(), ttl: expires });
    return true;
  }

  async del(key: string): Promise<boolean> {
    this.cache.delete(key);
    return true;
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  deleteByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
const globalCache = new InMemoryCache();

// Clean up expired entries every 2 minutes
setInterval(() => {
  globalCache.cleanup();
}, 2 * 60 * 1000);

/**
 * Cache Manager - Pure in-memory implementation
 * Perfect for Vercel serverless functions
 */
export class CacheManager {
  static async get<T>(key: string): Promise<T | null> {
    return await globalCache.get<T>(key);
  }

  static async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    return await globalCache.set(key, value, ttlSeconds);
  }

  static async del(key: string): Promise<boolean> {
    return await globalCache.del(key);
  }

  static async exists(key: string): Promise<boolean> {
    return await globalCache.exists(key);
  }

  static getStats() {
    return globalCache.getStats();
  }

  static clear() {
    globalCache.clear();
  }

  static async deleteByPrefix(prefix: string): Promise<void> {
    globalCache.deleteByPrefix(prefix);
  }
}

// Legacy RedisManager for compatibility (now just uses in-memory)
export class RedisManager {
  static async getClient(): Promise<null> {
    return null; // No Redis client needed
  }

  static async disconnect(): Promise<void> {
    // No-op
  }

  static async get(key: string): Promise<string | null> {
    return await CacheManager.get(key);
  }

  static async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    return await CacheManager.set(key, value, ttlSeconds);
  }

  static async del(key: string): Promise<boolean> {
    return await CacheManager.del(key);
  }

  static async exists(key: string): Promise<boolean> {
    return await CacheManager.exists(key);
  }
}
