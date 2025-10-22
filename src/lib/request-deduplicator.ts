/**
 * Request Deduplicator - Prevents duplicate requests from being processed simultaneously
 * This reduces redundant Firestore reads when multiple identical requests are made
 */

export class RequestDeduplicator {
  private static instance: RequestDeduplicator;
  private pendingRequests = new Map<string, Promise<any>>();
  private completedRequests = new Map<string, { result: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds cache for completed requests

  static getInstance(): RequestDeduplicator {
    if (!RequestDeduplicator.instance) {
      RequestDeduplicator.instance = new RequestDeduplicator();
    }
    return RequestDeduplicator.instance;
  }

  /**
   * Deduplicate a request by key
   * If the same request is already in progress, return the existing promise
   * If the same request was recently completed, return the cached result
   */
  async deduplicate<T>(
    key: string, 
    fetcher: () => Promise<T>,
    cacheDuration: number = this.CACHE_DURATION
  ): Promise<T> {
    // Check if request is already in progress
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Check if request was recently completed
    const completed = this.completedRequests.get(key);
    if (completed && (Date.now() - completed.timestamp) < cacheDuration) {
      return completed.result;
    }

    // Start new request
    const promise = fetcher();
    this.pendingRequests.set(key, promise);

    try {
      const result = await promise;
      
      // Cache the result
      this.completedRequests.set(key, {
        result,
        timestamp: Date.now()
      });

      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Create a cache key for API requests
   */
  static createCacheKey(
    endpoint: string,
    params: Record<string, any>,
    userId?: string
  ): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, any>);

    const keyData = {
      endpoint,
      params: sortedParams,
      userId
    };

    return `dedup:${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
  }

  /**
   * Clear expired cache entries
   */
  cleanup(): void {
    const now = Date.now();
    
    // Clean up completed requests cache
    for (const [key, value] of this.completedRequests.entries()) {
      if ((now - value.timestamp) > this.CACHE_DURATION) {
        this.completedRequests.delete(key);
      }
    }
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.pendingRequests.clear();
    this.completedRequests.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    pendingRequests: number;
    completedRequests: number;
    cacheHitRate: number;
  } {
    return {
      pendingRequests: this.pendingRequests.size,
      completedRequests: this.completedRequests.size,
      cacheHitRate: this.completedRequests.size / (this.pendingRequests.size + this.completedRequests.size) || 0
    };
  }
}

// Start cleanup interval
const deduplicator = RequestDeduplicator.getInstance();
setInterval(() => {
  deduplicator.cleanup();
}, 60000); // Clean up every minute

export default RequestDeduplicator;
