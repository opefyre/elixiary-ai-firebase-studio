import { NextRequest } from 'next/server';
import { APIKeyManager } from './api-keys';
import { RateLimiter } from './rate-limiter';
import { APIError, APIResponse } from '@/types/api';

export class APIAuthenticator {
  private apiKeyManager: APIKeyManager;
  private rateLimiter: RateLimiter;

  constructor() {
    this.apiKeyManager = new APIKeyManager();
    this.rateLimiter = new RateLimiter();
  }

  /**
   * Authenticate API request
   */
  async authenticateRequest(request: NextRequest): Promise<{
    user: any;
    apiKey: any;
    rateLimit: any;
  }> {
    try {
      // Extract credentials
      const apiKey = request.headers.get('x-api-key');
      const email = request.headers.get('x-user-email');

      // Validate required headers
      if (!apiKey || !email) {
        throw new APIError('Missing required headers', 'x-api-key and x-user-email headers are required', 401);
      }

      // Validate API key format
      if (!apiKey.startsWith('elx_live_') || apiKey.length !== 48) {
        throw new APIError('Invalid API key format', 'API key must start with elx_live_ and be 48 characters long', 401);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new APIError('Invalid email format', 'Please provide a valid email address', 401);
      }

      // For now, skip rate limiting during build to avoid issues
      // TODO: Re-enable rate limiting after build is fixed
      const rateLimitStatus = {
        requestsPerHour: 0,
        requestsPerDay: 0,
        requestsPerMonth: 0,
        remainingHourly: 100,
        remainingDaily: 1000,
        remainingMonthly: 10000,
        resetTimeHourly: new Date(),
        resetTimeDaily: new Date(),
        resetTimeMonthly: new Date()
      };

      // Validate API key and get user data
      const keyData = await this.apiKeyManager.validateAPIKey(apiKey, email);

      // Get user data
      const { adminDb } = await import('@/firebase/server');
      const userDoc = await adminDb.collection('users').doc(keyData.userId).get();
      const user = userDoc.data();

      return {
        user,
        apiKey: keyData,
        rateLimit: rateLimitStatus
      };

    } catch (error: any) {
      if (error instanceof APIError) {
        throw error;
      }
      
      console.error('API authentication error:', error);
      throw new APIError('Authentication failed', 'Invalid credentials or server error', 401);
    }
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return 'unknown';
  }

  /**
   * Validate request size
   */
  validateRequestSize(request: NextRequest): void {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB
      throw new APIError('Request too large', 'Request size exceeds 1MB limit', 413);
    }
  }

  /**
   * Sanitize input data
   */
  sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      // Remove potentially dangerous characters
      return data
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeInput(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * Create error response
   */
  createErrorResponse(error: APIError, requestId?: string): APIResponse {
    return {
      success: false,
      error: {
        error: error.error,
        message: error.message,
        statusCode: error.statusCode,
        timestamp: new Date(),
        requestId
      }
    };
  }

  /**
   * Create success response
   */
  createSuccessResponse<T>(data: T, rateLimit?: any, requestId?: string): APIResponse<T> {
    return {
      success: true,
      data,
      meta: {
        requestId: requestId || this.generateRequestId(),
        timestamp: new Date(),
        rateLimit
      }
    };
  }

  /**
   * Generate request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Custom API Error class
export class APIError extends Error {
  public statusCode: number;
  public error: string;

  constructor(error: string, message: string, statusCode: number) {
    super(message);
    this.name = 'APIError';
    this.error = error;
    this.statusCode = statusCode;
  }
}
