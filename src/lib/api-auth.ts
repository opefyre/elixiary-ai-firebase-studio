import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { APIKeyManager } from './api-keys';
import { RateLimiter } from './rate-limiter';
import { InputSanitizer } from './input-sanitizer';
import { CryptoUtils } from './crypto-utils';
import { AuditLogger } from './audit-logger';
import { APIError as APIErrorInterface, APIResponse } from '@/types/api';

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
    requestId: string;
  }> {
    let apiKey: string | null = null;
    let email: string | null = null;
    const requestId = AuditLogger.getRequestId(request);
    const auditLogger = new AuditLogger();
    const startTime = Date.now();
    
    try {
      // Extract and sanitize credentials
      const rawApiKey = request.headers.get('x-api-key');
      const rawEmail = request.headers.get('x-user-email');

      if (!rawApiKey || !rawEmail) {
        // Log missing headers security event
        await auditLogger.logSecurityEvent(
          requestId,
          'authentication_failed',
          {
            endpoint: AuditLogger.getEndpoint(request),
            method: request.method,
            ipAddress: AuditLogger.getClientIP(request),
            userAgent: request.headers.get('user-agent') ?? undefined
          },
          {
            errorMessage: 'Missing required headers',
            statusCode: 401
          }
        );
        throw new APIError('Missing required headers', 'x-api-key and x-user-email headers are required', 401);
      }

      // Check brute force protection before processing
      const clientIP = AuditLogger.getClientIP(request);
      const bruteForceCheck = await this.rateLimiter.checkBruteForceProtection(clientIP, 'api_auth');
      
      if (!bruteForceCheck.allowed) {
        // Log brute force attempt
        await auditLogger.logSecurityEvent(
          requestId,
          'authentication_failed',
          {
            endpoint: AuditLogger.getEndpoint(request),
            method: request.method,
            ipAddress: clientIP,
            userAgent: request.headers.get('user-agent') ?? undefined
          },
          {
            email: rawEmail,
            errorMessage: 'Rate limit exceeded - too many failed attempts',
            statusCode: 429
          }
        );
        throw new APIError('Rate limit exceeded', `Too many failed attempts. Try again in ${bruteForceCheck.retryAfter} seconds.`, 429);
      }

      try {
        // Sanitize and validate inputs
        apiKey = this.sanitizeApiKey(rawApiKey);
        email = this.sanitizeEmail(rawEmail);
      } catch (sanitizationError: any) {
        // Log invalid input security event
        await auditLogger.logSecurityEvent(
          requestId,
          'authentication_failed',
          {
            endpoint: AuditLogger.getEndpoint(request),
            method: request.method,
            ipAddress: AuditLogger.getClientIP(request),
            userAgent: request.headers.get('user-agent') ?? undefined
          },
          {
            email: rawEmail,
            errorMessage: 'Invalid input format',
            statusCode: 401
          }
        );
        throw new APIError('Invalid input format', sanitizationError.message, 401);
      }

      // Validate API key and get user data first
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

      // Check rate limiting with bypass detection
      const rateLimitStatus = await this.rateLimiter.checkRateLimitWithBypassDetection(keyData.userId, clientIP);
      
      // Log potential bypass attempts
      if (rateLimitStatus.bypassDetected) {
        try {
          await auditLogger.logSecurityEvent(
            requestId,
            'authentication_failed',
            {
              endpoint: AuditLogger.getEndpoint(request),
              method: request.method,
              ipAddress: clientIP,
              userAgent: request.headers.get('user-agent') ?? undefined
            },
            {
              userId: keyData.userId,
              errorMessage: 'Potential rate limit bypass detected',
              metadata: {
                userRateLimit: rateLimitStatus,
                bypassDetected: true
              }
            }
          );
        } catch (error) {
          // Don't fail authentication if security logging fails
        }
      }

      // Update API key usage counters
      try {
        await this.updateAPIKeyUsage(apiKey, email, adminDb);
      } catch (error) {
        // Don't throw error to avoid breaking the API
      }

      // Clear brute force protection on successful authentication
      try {
        await this.rateLimiter.clearBruteForceProtection(clientIP, 'api_auth');
      } catch (error) {
        // Don't fail authentication if brute force clearing fails
      }

      return {
        user,
        apiKey: keyData,
        rateLimit: rateLimitStatus,
        requestId
      };

    } catch (error: any) {
      // Log authentication failures with appropriate event type
      let eventType: 'authentication_failed' | 'invalid_key' | 'expired_key' = 'authentication_failed';
      let errorMessage = 'Authentication failed';
      
      if (error.message?.includes('Invalid API key')) {
        eventType = 'invalid_key';
        errorMessage = 'Invalid API key';
      } else if (error.message?.includes('expired')) {
        eventType = 'expired_key';
        errorMessage = 'API key has expired';
      }

      // Log security event
      await auditLogger.logSecurityEvent(
        requestId,
        eventType,
        {
          endpoint: AuditLogger.getEndpoint(request),
          method: request.method,
          ipAddress: AuditLogger.getClientIP(request),
          userAgent: request.headers.get('user-agent') ?? undefined
        },
        {
          email: email,
          errorMessage: errorMessage,
          statusCode: error instanceof APIError ? error.statusCode : 401
        }
      );

      if (error instanceof APIError) {
        throw error;
      }
      
      // Log error without exposing sensitive information
      throw new APIError('Authentication failed', 'Invalid credentials or server error', 401);
    }
  }

  /**
   * Update API key usage counters
   */
  private async updateAPIKeyUsage(apiKey: string, email: string, adminDb: any): Promise<void> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // First, get the current usage data using hashed storage
      const keyId = CryptoUtils.generateAPIKeyId(apiKey);
      const keyDoc = await adminDb.collection('api_keys').doc(keyId).get();
      if (!keyDoc.exists) {
        return;
      }
      
      const keyData = keyDoc.data();
      
      // Check if we need to reset daily/monthly counters
      let requestsToday = 1;
      let requestsThisMonth = 1;
      
      if (keyData.usage?.lastUsed) {
        const lastUsed = keyData.usage.lastUsed?.toDate ? keyData.usage.lastUsed.toDate() : new Date(keyData.usage.lastUsed);
        const lastUsedDate = new Date(lastUsed.getFullYear(), lastUsed.getMonth(), lastUsed.getDate());
        const lastUsedMonth = new Date(lastUsed.getFullYear(), lastUsed.getMonth(), 1);
        
        if (lastUsedDate >= today) {
          requestsToday = (keyData.usage.requestsToday || 0) + 1;
        }
        
        if (lastUsedMonth >= thisMonth) {
          requestsThisMonth = (keyData.usage.requestsThisMonth || 0) + 1;
        }
      }
      
      // Update usage counters in the API key document
      const updateData = {
        'usage.totalRequests': FieldValue.increment(1),
        'usage.lastUsed': now,
        'usage.requestsToday': requestsToday,
        'usage.requestsThisMonth': requestsThisMonth,
        'updatedAt': now
      };
      
      await adminDb.collection('api_keys').doc(keyId).update(updateData);
      
    } catch (error) {
      // Don't throw error to avoid breaking the API
    }
  }

  /**
   * Get client IP address - SECURITY: Use secure IP extraction to prevent spoofing
   */
  private getClientIP(request: NextRequest): string {
    // Use the secure IP extraction method from AuditLogger
    return AuditLogger.getClientIP(request);
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
   * Sanitize input data using advanced sanitization
   */
  sanitizeInput(data: any): any {
    return InputSanitizer.sanitizeObject(data);
  }

  /**
   * Sanitize email input specifically
   */
  sanitizeEmail(email: string): string {
    return InputSanitizer.sanitizeEmail(email);
  }

  /**
   * Sanitize API key input specifically
   */
  sanitizeApiKey(apiKey: string): string {
    return InputSanitizer.sanitizeApiKey(apiKey);
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
