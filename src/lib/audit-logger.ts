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
   * Extract IP address from request - SECURITY: Prevents IP spoofing attacks
   * Priority order: Next.js request.ip -> Vercel x-vercel-ip -> trusted proxies only
   */
  static getClientIP(request: Request): string {
    // 1. Next.js provides request.ip which is more trustworthy
    const nextJsIP = (request as any).ip;
    if (nextJsIP && this.isValidIP(nextJsIP)) {
      return this.normalizeIP(nextJsIP);
    }

    // 2. Vercel-specific header (more trustworthy than X-Forwarded-For)
    const vercelIP = request.headers.get('x-vercel-ip');
    if (vercelIP && this.isValidIP(vercelIP)) {
      return this.normalizeIP(vercelIP);
    }

    // 3. Only trust X-Forwarded-For from known trusted proxies
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      // Parse the forwarded chain and validate each IP
      const ips = forwarded.split(',').map(ip => ip.trim());
      for (const ip of ips) {
        if (this.isValidIP(ip) && this.isTrustedProxy(ip)) {
          return this.normalizeIP(ip);
        }
      }
    }

    // 4. X-Real-IP from trusted sources only
    const realIP = request.headers.get('x-real-ip');
    if (realIP && this.isValidIP(realIP) && this.isTrustedProxy(realIP)) {
      return this.normalizeIP(realIP);
    }

    // 5. Fallback to unknown if no trustworthy IP found
    return 'unknown';
  }

  /**
   * Validate IP address format to prevent spoofing
   */
  private static isValidIP(ip: string): boolean {
    if (!ip || typeof ip !== 'string') return false;

    // IPv4 validation (strict)
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 validation (comprehensive)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * Check if IP is from a trusted proxy (Vercel, Cloudflare, etc.)
   */
  private static isTrustedProxy(ip: string): boolean {
    // Vercel IP ranges (simplified - in production, use their official IP ranges)
    const vercelRanges = [
      '76.76.19.0/24',  // Vercel example range
      '76.76.20.0/24',  // Vercel example range
    ];

    // Cloudflare IP ranges (simplified)
    const cloudflareRanges = [
      '173.245.48.0/20',
      '103.21.244.0/22',
      '103.22.200.0/22',
      '103.31.4.0/22',
      '141.101.64.0/18',
      '108.162.192.0/18',
      '190.93.240.0/20',
      '188.114.96.0/20',
      '197.234.240.0/22',
      '198.41.128.0/17',
      '162.158.0.0/15',
      '104.16.0.0/13',
      '104.24.0.0/14',
      '172.64.0.0/13',
      '131.0.72.0/22',
    ];

    // For now, be conservative and only trust known infrastructure IPs
    // In production, implement proper CIDR range checking
    return this.isInCIDRRange(ip, vercelRanges) || this.isInCIDRRange(ip, cloudflareRanges);
  }

  /**
   * Check if IP is within CIDR ranges (simplified implementation)
   */
  private static isInCIDRRange(ip: string, ranges: string[]): boolean {
    // For now, be conservative and only trust specific known IPs
    // In production, implement proper CIDR range checking with a library like ip-range-check
    const knownTrustedIPs = [
      '127.0.0.1',      // localhost
      '::1',            // localhost IPv6
      // Add known Vercel IPs when available
    ];

    return knownTrustedIPs.includes(ip);
  }

  /**
   * Normalize IP address for consistent Firestore keys
   */
  private static normalizeIP(ip: string): string {
    // Convert IPv6-mapped IPv4 addresses to IPv4
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7);
    }
    
    // Convert IPv6 localhost to IPv4 localhost for consistency
    if (ip === '::1') {
      return '127.0.0.1';
    }
    
    return ip.toLowerCase();
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
