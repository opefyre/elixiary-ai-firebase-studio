import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { AuditLogger } from './audit-logger';

/**
 * Comprehensive security middleware for API endpoints
 */
export class SecurityMiddleware {
  /**
   * Add comprehensive security headers to API responses
   */
  static addSecurityHeaders(response: NextResponse): NextResponse {
    // CORS headers for API endpoints
    response.headers.set('Access-Control-Allow-Origin', 'https://www.elixiary.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'x-api-key, x-user-email, content-type, authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Access-Control-Allow-Credentials', 'false');

    // Additional security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // API-specific security headers
    response.headers.set('X-API-Version', '1.0.0');
    response.headers.set('X-Response-Time', Date.now().toString());
    
    return response;
  }

  /**
   * Validate request size and content type
   */
  static validateRequestSizeAndType(request: NextRequest): { valid: boolean; error?: string } {
    const contentType = request.headers.get('content-type');
    
    // For POST/PUT/PATCH requests, require JSON content type
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      if (!contentType || !contentType.includes('application/json')) {
        return { valid: false, error: 'Content-Type must be application/json' };
      }
    }

    // Check content length
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength);
      if (size > 1024 * 1024) { // 1MB limit
        return { valid: false, error: 'Request payload too large' };
      }
    }

    return { valid: true };
  }

  /**
   * Handle CORS preflight requests
   */
  static handleCorsPreflight(request: NextRequest): NextResponse {
    const response = new NextResponse(null, { status: 200 });
    return this.addSecurityHeaders(response);
  }

  /**
   * Log potential security threats
   */
  static async logSecurityThreat(
    request: NextRequest,
    threatType: 'suspicious_user_agent' | 'unusual_request_pattern' | 'potential_attack',
    details: any
  ): Promise<void> {
    try {
      const auditLogger = new AuditLogger();
      const requestId = AuditLogger.getRequestId(request);
      
      await auditLogger.logSecurityEvent(
        requestId,
        'authentication_failed', // Using existing event type
        {
          endpoint: AuditLogger.getEndpoint(request),
          method: request.method,
          ipAddress: AuditLogger.getClientIP(request),
          userAgent: request.headers.get('user-agent') || undefined
        },
        {
          errorMessage: `Security threat detected: ${threatType}`,
          metadata: { threatType, details }
        }
      );
    } catch (error) {
      // Don't fail the request if security logging fails
      console.error('Security logging failed:', error);
    }
  }

  /**
   * Detect suspicious user agents
   */
  static detectSuspiciousUserAgent(userAgent: string | null): boolean {
    if (!userAgent) return false;
    
    const suspiciousPatterns = [
      /sqlmap/i,
      /nmap/i,
      /nikto/i,
      /wget/i,
      /curl/i,
      /python/i,
      /libwww-perl/i,
      /java/i,
      /scanner/i,
      /bot/i,
      /crawler/i,
      /spider/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Validate API request format and headers
   */
  static validateAPIRequest(request: NextRequest): { valid: boolean; error?: string } {
    // Check for required API headers
    const apiKey = request.headers.get('x-api-key');
    const userEmail = request.headers.get('x-user-email');
    
    if (!apiKey || !userEmail) {
      return { valid: false, error: 'Missing required API headers' };
    }

    // Check for suspicious user agent
    const userAgent = request.headers.get('user-agent');
    if (this.detectSuspiciousUserAgent(userAgent)) {
      this.logSecurityThreat(request, 'suspicious_user_agent', { userAgent });
      // Don't block, but log for monitoring
    }

    return { valid: true };
  }

  /**
   * CSRF Protection for state-changing operations
   */
  static validateCSRFToken(request: NextRequest, expectedOrigin?: string): { valid: boolean; error?: string } {
    // For API endpoints, CSRF protection is handled via API key authentication
    // and proper CORS configuration
    
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // Validate origin for state-changing operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      if (origin && expectedOrigin) {
        try {
          const originUrl = new URL(origin);
          const expectedUrl = new URL(expectedOrigin);
          
          if (originUrl.hostname !== expectedUrl.hostname) {
            return { valid: false, error: 'Invalid origin for CSRF protection' };
          }
        } catch {
          return { valid: false, error: 'Invalid origin format' };
        }
      }
      
      // Additional check for referer header
      if (referer && expectedOrigin) {
        try {
          const refererUrl = new URL(referer);
          const expectedUrl = new URL(expectedOrigin);
          
          if (refererUrl.hostname !== expectedUrl.hostname) {
            return { valid: false, error: 'Invalid referer for CSRF protection' };
          }
        } catch {
          // Referer validation failure is not critical for API endpoints
        }
      }
    }

    return { valid: true };
  }

  /**
   * Request signature validation for critical endpoints
   */
  static validateRequestSignature(
    request: NextRequest,
    body: string,
    secret: string
  ): { valid: boolean; error?: string } {
    const signature = request.headers.get('x-signature') || request.headers.get('x-hub-signature-256');
    
    if (!signature) {
      return { valid: false, error: 'Missing request signature' };
    }

    try {
      const expectedSignature = createHmac('sha256', secret)
        .update(body, 'utf8')
        .digest('hex');
      
      // Extract signature value if it includes algorithm prefix
      const receivedSignature = signature.replace(/^sha256=/, '');
      
      // SECURITY: Use timing-safe comparison to prevent timing attacks
      const expectedBuffer = Buffer.from(expectedSignature, 'hex');
      const receivedBuffer = Buffer.from(receivedSignature, 'hex');
      
      // Ensure both buffers are the same length to prevent timing attacks
      if (expectedBuffer.length !== receivedBuffer.length) {
        return { valid: false, error: 'Invalid request signature' };
      }
      
      if (!timingSafeEqual(expectedBuffer, receivedBuffer)) {
        return { valid: false, error: 'Invalid request signature' };
      }
      
      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Signature validation failed' };
    }
  }
}
