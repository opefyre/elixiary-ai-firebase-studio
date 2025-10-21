export interface APIKey {
  id: string;                    // API key (e.g., "elx_live_...")
  userId: string;                // Pro user's UID
  email: string;                // User's email
  name: string;                 // API key name (user-defined)
  tier: "pro";                  // Always pro for API access
  status: "active" | "suspended" | "revoked";
  keyHash?: string;             // Hashed version of the API key for secure storage
  permissions: {
    recipes: boolean;           // Access to recipe endpoints
    userData: boolean;          // Access to user's saved recipes
    rateLimit: number;          // Requests per hour
    dailyLimit: number;         // Requests per day
    monthlyLimit: number;       // Requests per month
  };
  usage: {
    requestsToday: number;
    requestsThisMonth: number;
    lastUsed: Date;
    totalRequests: number;
  };
  createdAt: Date;
  expiresAt: Date;              // 1 year expiration
  lastRotated: Date;
}

export interface APIUsage {
  id: string;
  apiKey: string;
  userId: string;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  requestSize: number;
  responseSize: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  reason?: string;
  retryAfter?: number;
  requestsPerHour: number;
  requestsPerDay: number;
  requestsPerMonth: number;
  remainingHourly: number;
  remainingDaily: number;
  remainingMonthly: number;
  resetTimeHourly: Date;
  resetTimeDaily: Date;
  resetTimeMonthly: Date;
}

export interface APIError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  requestId?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: {
    requestId: string;
    timestamp: Date;
    rateLimit?: RateLimitStatus;
  };
}

// Rate limiting configuration
export const RATE_LIMITS = {
  pro: {
    requestsPerHour: 100,       // 100 requests/hour
    requestsPerDay: 1000,       // 1,000 requests/day
    requestsPerMonth: 10000,    // 10,000 requests/month
    burstLimit: 20,             // 20 requests in 1 minute burst
    cooldownPeriod: 300000      // 5 minutes cooldown after burst
  }
} as const;

// Security limits
export const SECURITY_LIMITS = {
  maxConcurrentRequests: 5,     // Max 5 concurrent requests per key
  requestSizeLimit: 1024 * 1024, // 1MB max request size
  responseSizeLimit: 5 * 1024 * 1024, // 5MB max response size
  requestTimeout: 30000,        // 30 second timeout
  maxApiKeysPerUser: 3          // Max 3 API keys per user
} as const;
