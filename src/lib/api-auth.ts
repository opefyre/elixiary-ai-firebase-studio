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
    let apiKey: string | null = null;
    let email: string | null = null;
    
    try {
      // Extract credentials
      apiKey = request.headers.get('x-api-key');
      email = request.headers.get('x-user-email');

      // Validate required headers
      if (!apiKey || !email) {
        throw new APIError('Missing required headers', 'x-api-key and x-user-email headers are required', 401);
      }

      // Validate API key format
      if (!apiKey.startsWith('elx_live_') || apiKey.length < 40) {
        throw new APIError('Invalid API key format', 'API key must start with elx_live_ and be at least 40 characters long', 401);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new APIError('Invalid email format', 'Please provide a valid email address', 401);
      }

      // Check rate limiting
      const rateLimitStatus = await this.rateLimiter.checkRateLimit(apiKey, email);

      // Validate API key and get user data
      const keyData = await this.apiKeyManager.validateAPIKey(apiKey, email);

      // Get user data
      const { initializeFirebaseServer } = await import('@/firebase/server');
      const { adminDb } = initializeFirebaseServer();
      const userDoc = await adminDb.collection('users').doc(keyData.userId).get();
      const user = {
        id: userDoc.id,
        uid: keyData.userId, // Firebase Auth UID
        ...userDoc.data()
      };

      // Update API key usage counters
      await this.updateAPIKeyUsage(apiKey, email);

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
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        apiKey: apiKey?.substring(0, 10) + '...',
        email: email
      });
      throw new APIError('Authentication failed', `Invalid credentials or server error: ${error.message}`, 401);
    }
  }

  /**
   * Update API key usage counters
   */
  private async updateAPIKeyUsage(apiKey: string, email: string): Promise<void> {
    try {
      console.log('=== Starting API key usage update ===');
      console.log('API Key:', apiKey.substring(0, 20) + '...');
      console.log('Email:', email);
      
      const { initializeFirebaseServer } = await import('@/firebase/server');
      const { adminDb } = initializeFirebaseServer();
      
      console.log('Firebase admin initialized');
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      console.log('Current time:', now.toISOString());
      console.log('Today:', today.toISOString());
      console.log('This month:', thisMonth.toISOString());
      
      // First, get the current usage data
      console.log('Fetching API key document...');
      const keyDoc = await adminDb.collection('api_keys').doc(apiKey).get();
      if (!keyDoc.exists) {
        console.error('API key document not found:', apiKey);
        return;
      }
      
      const keyData = keyDoc.data();
      console.log('Current usage data:', JSON.stringify(keyData.usage, null, 2));
      
      // Check if we need to reset daily/monthly counters
      let requestsToday = 1;
      let requestsThisMonth = 1;
      
      if (keyData.usage?.lastUsed) {
        const lastUsed = keyData.usage.lastUsed?.toDate ? keyData.usage.lastUsed.toDate() : new Date(keyData.usage.lastUsed);
        const lastUsedDate = new Date(lastUsed.getFullYear(), lastUsed.getMonth(), lastUsed.getDate());
        const lastUsedMonth = new Date(lastUsed.getFullYear(), lastUsed.getMonth(), 1);
        
        console.log('Last used:', lastUsed.toISOString());
        console.log('Last used date:', lastUsedDate.toISOString());
        console.log('Last used month:', lastUsedMonth.toISOString());
        
        if (lastUsedDate >= today) {
          requestsToday = (keyData.usage.requestsToday || 0) + 1;
          console.log('Same day - incrementing today counter to:', requestsToday);
        } else {
          console.log('New day - resetting today counter to 1');
        }
        
        if (lastUsedMonth >= thisMonth) {
          requestsThisMonth = (keyData.usage.requestsThisMonth || 0) + 1;
          console.log('Same month - incrementing month counter to:', requestsThisMonth);
        } else {
          console.log('New month - resetting month counter to 1');
        }
      } else {
        console.log('No lastUsed data - initializing counters to 1');
      }
      
      // Update usage counters in the API key document
      console.log('Updating Firestore document...');
      const updateData = {
        'usage.totalRequests': adminDb.FieldValue.increment(1),
        'usage.lastUsed': now,
        'usage.requestsToday': requestsToday,
        'usage.requestsThisMonth': requestsThisMonth,
        'updatedAt': now
      };
      
      console.log('Update data:', JSON.stringify(updateData, null, 2));
      
      await adminDb.collection('api_keys').doc(apiKey).update(updateData);
      
      console.log('Successfully updated usage counters:', {
        totalRequests: 'incremented by 1',
        lastUsed: now.toISOString(),
        requestsToday: requestsToday,
        requestsThisMonth: requestsThisMonth
      });
      console.log('=== API key usage update completed ===');
      
    } catch (error) {
      // Don't throw error to avoid breaking the API
      console.error('Error updating API key usage:', error);
      console.error('Error stack:', error.stack);
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
