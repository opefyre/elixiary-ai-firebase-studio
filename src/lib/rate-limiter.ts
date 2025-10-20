import { initializeFirebaseServer } from '@/firebase/server';
import { RATE_LIMITS, SECURITY_LIMITS, RateLimitStatus } from '@/types/api';

export class RateLimiter {
  private adminDb: any;
  private rateLimitCache: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    const { adminDb } = initializeFirebaseServer();
    this.adminDb = adminDb;
  }

  /**
   * Check if request is within rate limits using authenticated user ID
   */
  async checkRateLimit(userId: string, ipAddress: string): Promise<RateLimitStatus> {
    const now = Date.now();
    const hourKey = `rate_limit:user:${userId}:hour:${Math.floor(now / (60 * 60 * 1000))}`;
    const dayKey = `rate_limit:user:${userId}:day:${Math.floor(now / (24 * 60 * 60 * 1000))}`;
    const monthKey = `rate_limit:user:${userId}:month:${Math.floor(now / (30 * 24 * 60 * 60 * 1000))}`;
    const ipKey = `rate_limit:ip:${ipAddress}:hour:${Math.floor(now / (60 * 60 * 1000))}`;

    // Check multiple rate limits
    const [hourlyCount, dailyCount, monthlyCount, ipCount] = await Promise.all([
      this.getRateLimitCount(hourKey),
      this.getRateLimitCount(dayKey),
      this.getRateLimitCount(monthKey),
      this.getRateLimitCount(ipKey)
    ]);

    // Check if any limit is exceeded
    if (hourlyCount >= RATE_LIMITS.pro.requestsPerHour) {
      throw new Error('Hourly rate limit exceeded');
    }
    if (dailyCount >= RATE_LIMITS.pro.requestsPerDay) {
      throw new Error('Daily rate limit exceeded');
    }
    if (monthlyCount >= RATE_LIMITS.pro.requestsPerMonth) {
      throw new Error('Monthly rate limit exceeded');
    }
    if (ipCount >= RATE_LIMITS.pro.requestsPerHour * 2) { // IP limit is 2x user limit
      throw new Error('IP rate limit exceeded');
    }

    // Increment counters
    await Promise.all([
      this.incrementRateLimit(hourKey, 60 * 60), // 1 hour TTL
      this.incrementRateLimit(dayKey, 24 * 60 * 60), // 1 day TTL
      this.incrementRateLimit(monthKey, 30 * 24 * 60 * 60), // 30 days TTL
      this.incrementRateLimit(ipKey, 60 * 60) // 1 hour TTL
    ]);

    // Calculate reset times
    const hourReset = new Date(Math.ceil(now / (60 * 60 * 1000)) * (60 * 60 * 1000));
    const dayReset = new Date(Math.ceil(now / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000));
    const monthReset = new Date(Math.ceil(now / (30 * 24 * 60 * 60 * 1000)) * (30 * 24 * 60 * 60 * 1000));

    return {
      requestsPerHour: hourlyCount + 1,
      requestsPerDay: dailyCount + 1,
      requestsPerMonth: monthlyCount + 1,
      remainingHourly: RATE_LIMITS.pro.requestsPerHour - (hourlyCount + 1),
      remainingDaily: RATE_LIMITS.pro.requestsPerDay - (dailyCount + 1),
      remainingMonthly: RATE_LIMITS.pro.requestsPerMonth - (monthlyCount + 1),
      resetTimeHourly: hourReset,
      resetTimeDaily: dayReset,
      resetTimeMonthly: monthReset
    };
  }

  /**
   * Get current rate limit count
   */
  private async getRateLimitCount(key: string): Promise<number> {
    // Check cache first
    const cached = this.rateLimitCache.get(key);
    if (cached && cached.resetTime > Date.now()) {
      return cached.count;
    }

    // Check database
    try {
      const doc = await this.adminDb.collection('rate_limits').doc(key).get();
      if (doc.exists) {
        const data = doc.data();
        const count = data.count || 0;
        const resetTime = data.resetTime || 0;
        
        // Cache the result
        this.rateLimitCache.set(key, { count, resetTime });
        
        return count;
      }
    } catch (error) {
      // Silently handle error to avoid breaking the API
    }

    return 0;
  }

  /**
   * Increment rate limit counter
   */
  private async incrementRateLimit(key: string, ttlSeconds: number): Promise<void> {
    try {
      const resetTime = Date.now() + (ttlSeconds * 1000);
      
      // Use a transaction to safely increment
      let newCount = 1;
      await this.adminDb.runTransaction(async (transaction: any) => {
        const docRef = this.adminDb.collection('rate_limits').doc(key);
        const doc = await transaction.get(docRef);
        
        if (doc.exists) {
          const currentCount = doc.data().count || 0;
          newCount = currentCount + 1;
          transaction.update(docRef, {
            count: newCount,
            lastUpdated: new Date()
          });
        } else {
          transaction.set(docRef, {
            count: newCount,
            resetTime,
            lastUpdated: new Date()
          });
        }
      });

      // Update cache with actual count
      this.rateLimitCache.set(key, { count: newCount, resetTime });
    } catch (error) {
      // Don't throw error to avoid breaking the API
    }
  }

  /**
   * Check burst limit (requests per minute) using authenticated user ID
   */
  async checkBurstLimit(userId: string): Promise<boolean> {
    const now = Date.now();
    const minuteKey = `burst_limit:user:${userId}:${Math.floor(now / (60 * 1000))}`;
    
    const count = await this.getRateLimitCount(minuteKey);
    
    if (count >= RATE_LIMITS.pro.burstLimit) {
      return false; // Burst limit exceeded
    }

    await this.incrementRateLimit(minuteKey, 60); // 1 minute TTL
    return true;
  }

  /**
   * Check and track failed authentication attempts for brute force protection
   */
  async checkBruteForceProtection(
    identifier: string, // Can be IP, email, or user ID
    context: 'api_auth' | 'firebase_auth' = 'api_auth'
  ): Promise<{ allowed: boolean; retryAfter?: number; attemptsRemaining?: number }> {
    const now = Date.now();
    const key = `brute_force:${context}:${identifier}:${Math.floor(now / (60 * 1000))}`; // 1 minute windows
    
    try {
      const attemptCount = await this.getRateLimitCount(key);
      const maxAttempts = 5; // 5 failed attempts per minute
      
      if (attemptCount >= maxAttempts) {
        // Calculate retry after time (next minute)
        const nextWindow = Math.ceil(now / (60 * 1000)) * (60 * 1000);
        const retryAfter = Math.ceil((nextWindow - now) / 1000);
        
        return {
          allowed: false,
          retryAfter,
          attemptsRemaining: 0
        };
      }
      
      // Increment attempt count
      await this.incrementRateLimit(key, 60); // 1 minute TTL
      
      return {
        allowed: true,
        attemptsRemaining: maxAttempts - attemptCount - 1
      };
    } catch (error) {
      // If rate limiting fails, allow the request but log the error
      console.error('Brute force protection error:', error);
      return { allowed: true };
    }
  }

  /**
   * Clear brute force protection for an identifier (after successful auth)
   */
  async clearBruteForceProtection(
    identifier: string,
    context: 'api_auth' | 'firebase_auth' = 'api_auth'
  ): Promise<void> {
    const now = Date.now();
    const key = `brute_force:${context}:${identifier}:${Math.floor(now / (60 * 1000))}`;
    
    try {
      // Clear the current window
      await this.adminDb.collection('rate_limits').doc(key).delete();
    } catch (error) {
      // Don't fail if cleanup fails
      console.error('Failed to clear brute force protection:', error);
    }
  }

  /**
   * Enhanced rate limiting with bypass detection
   */
  async checkRateLimitWithBypassDetection(
    userId: string, 
    ipAddress: string
  ): Promise<RateLimitStatus & { bypassDetected?: boolean }> {
    const rateLimitStatus = await this.checkRateLimit(userId, ipAddress);
    
    // Check for potential bypass attempts
    const userKey = `rate_limit:user:${userId}:hour:${Math.floor(Date.now() / (60 * 60 * 1000))}`;
    const ipKey = `rate_limit:ip:${ipAddress}:hour:${Math.floor(Date.now() / (60 * 60 * 1000))}`;
    
    const [userCount, ipCount] = await Promise.all([
      this.getRateLimitCount(userKey),
      this.getRateLimitCount(ipKey)
    ]);
    
    // Detect potential bypass: IP count much higher than user count
    const bypassDetected = ipCount > userCount * 3 && ipCount > 50;
    
    return {
      ...rateLimitStatus,
      bypassDetected
    };
  }

  /**
   * Clear rate limit cache
   */
  clearCache(): void {
    this.rateLimitCache.clear();
  }
}
