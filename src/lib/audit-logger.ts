import { initializeFirebaseServer } from '@/firebase/server';
import { randomBytes } from 'crypto';

export interface AuditLogEntry {
  id: string;
  requestId: string;
  timestamp: Date;
  userId?: string;
  apiKeyId?: string;
  email?: string;
  event: 'api_request' | 'api_error' | 'rate_limit_exceeded' | 'authentication_failed' | 'invalid_key' | 'expired_key';
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime?: number;
  ipAddress: string;
  userAgent?: string;
  requestSize?: number;
  responseSize?: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  private adminDb: any;

  constructor() {
    const { adminDb } = initializeFirebaseServer();
    this.adminDb = adminDb;
  }

  /**
   * Generate a unique request ID
   */
  static generateRequestId(): string {
    const timestamp = Date.now().toString(36);
    const random = randomBytes(8).toString('hex');
    return `req_${timestamp}_${random}`;
  }

  /**
   * Log API request
   */
  async logAPIRequest(
    requestId: string,
    request: {
      endpoint: string;
      method: string;
      userId?: string;
      apiKeyId?: string;
      email?: string;
      ipAddress: string;
      userAgent?: string;
      requestSize?: number;
    },
    response: {
      statusCode: number;
      responseTime: number;
      responseSize?: number;
    },
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const auditEntry: AuditLogEntry = {
        id: `${requestId}_${Date.now()}`,
        requestId,
        timestamp: new Date(),
        userId: request.userId,
        apiKeyId: request.apiKeyId,
        email: request.email,
        event: 'api_request',
        endpoint: request.endpoint,
        method: request.method,
        statusCode: response.statusCode,
        responseTime: response.responseTime,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        requestSize: request.requestSize,
        responseSize: response.responseSize,
        metadata
      };

      await this.adminDb.collection('audit_logs').add(auditEntry);
    } catch (error) {
      // Don't fail the request if audit logging fails
      // Audit logging error - silently fail to prevent recursive logging issues
    }
  }

  /**
   * Log security events
   */
  async logSecurityEvent(
    requestId: string,
    event: AuditLogEntry['event'],
    request: {
      endpoint: string;
      method: string;
      ipAddress: string;
      userAgent?: string;
    },
    details: {
      userId?: string;
      apiKeyId?: string;
      email?: string;
      errorMessage?: string;
      statusCode?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    try {
      const auditEntry: AuditLogEntry = {
        id: `${requestId}_${Date.now()}`,
        requestId,
        timestamp: new Date(),
        userId: details.userId,
        apiKeyId: details.apiKeyId,
        email: details.email,
        event,
        endpoint: request.endpoint,
        method: request.method,
        statusCode: details.statusCode || (event === 'authentication_failed' ? 401 : 400),
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        errorMessage: details.errorMessage,
        metadata: details.metadata
      };

      await this.adminDb.collection('audit_logs').add(auditEntry);
    } catch (error) {
      // Don't fail the request if audit logging fails
      // Security event logging error - silently fail to prevent recursive logging issues
    }
  }

  /**
   * Get request ID from headers or generate new one
   */
  static getRequestId(request: Request): string {
    const headerRequestId = request.headers.get('x-request-id');
    return headerRequestId && headerRequestId.length > 0 ? headerRequestId : this.generateRequestId();
  }

  /**
   * Extract IP address from request
   */
  static getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    if (realIP) {
      return realIP.trim();
    }
    return 'unknown';
  }

  /**
   * Extract endpoint from request URL
   */
  static getEndpoint(request: Request): string {
    try {
      const url = new URL(request.url);
      return url.pathname;
    } catch {
      return 'unknown';
    }
  }
}
