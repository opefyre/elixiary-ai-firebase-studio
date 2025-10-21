import { initializeFirebaseServer } from '@/firebase/server';
import { randomBytes } from 'crypto';
import * as ipaddr from 'ipaddr.js';

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
   * Validates proxy chains to ensure only legitimate client IPs are returned
   */
  static getClientIP(request: Request): string {
    // 1. Next.js provides request.ip which is most trustworthy
    const nextJsIP = (request as any).ip;
    if (nextJsIP && this.isValidIP(nextJsIP)) {
      return this.normalizeIP(nextJsIP);
    }

    // 2. Validate X-Forwarded-For chain - find first non-proxy IP
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      const ips = forwarded.split(',').map(ip => ip.trim());
      
      // Find the first IP that is NOT from a trusted proxy
      // This represents the actual client IP
      for (const ip of ips) {
        if (this.isValidIP(ip)) {
          // If this IP is not from a trusted proxy, it's likely the client
          if (!this.isTrustedProxy(ip)) {
            return this.normalizeIP(ip);
          }
        }
      }
    }

    // 3. Only trust X-Real-IP if we can validate the proxy chain
    const realIP = request.headers.get('x-real-ip');
    if (realIP && this.isValidIP(realIP)) {
      // Only trust if we have evidence of a valid proxy chain
      if (this.hasValidProxyChain(request)) {
        return this.normalizeIP(realIP);
      }
    }

    // 4. Only trust X-Vercel-IP if we can validate it came through Vercel
    const vercelIP = request.headers.get('x-vercel-ip');
    if (vercelIP && this.isValidIP(vercelIP)) {
      // Only trust if we have evidence of Vercel proxy chain
      if (this.hasValidVercelChain(request)) {
        return this.normalizeIP(vercelIP);
      }
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
    try {
      const parsedIP = ipaddr.process(ip);
      
      // Vercel IP ranges (official ranges)
      const vercelRanges = [
        '76.76.19.0/24',
        '76.76.20.0/24',
        '76.76.21.0/24',
        '76.76.22.0/24',
        '76.76.23.0/24',
        '76.76.24.0/24',
        '76.76.25.0/24',
        '76.76.26.0/24',
        '76.76.27.0/24',
        '76.76.28.0/24',
        '76.76.29.0/24',
        '76.76.30.0/24',
        '76.76.31.0/24',
        '76.76.32.0/24',
        '76.76.33.0/24',
        '76.76.34.0/24',
        '76.76.35.0/24',
        '76.76.36.0/24',
        '76.76.37.0/24',
        '76.76.38.0/24',
        '76.76.39.0/24',
        '76.76.40.0/24',
        '76.76.41.0/24',
        '76.76.42.0/24',
        '76.76.43.0/24',
        '76.76.44.0/24',
        '76.76.45.0/24',
        '76.76.46.0/24',
        '76.76.47.0/24',
        '76.76.48.0/24',
        '76.76.49.0/24',
        '76.76.50.0/24',
        '76.76.51.0/24',
        '76.76.52.0/24',
        '76.76.53.0/24',
        '76.76.54.0/24',
        '76.76.55.0/24',
        '76.76.56.0/24',
        '76.76.57.0/24',
        '76.76.58.0/24',
        '76.76.59.0/24',
        '76.76.60.0/24',
        '76.76.61.0/24',
        '76.76.62.0/24',
        '76.76.63.0/24',
        '76.76.64.0/24',
        '76.76.65.0/24',
        '76.76.66.0/24',
        '76.76.67.0/24',
        '76.76.68.0/24',
        '76.76.69.0/24',
        '76.76.70.0/24',
        '76.76.71.0/24',
        '76.76.72.0/24',
        '76.76.73.0/24',
        '76.76.74.0/24',
        '76.76.75.0/24',
        '76.76.76.0/24',
        '76.76.77.0/24',
        '76.76.78.0/24',
        '76.76.79.0/24',
        '76.76.80.0/24',
        '76.76.81.0/24',
        '76.76.82.0/24',
        '76.76.83.0/24',
        '76.76.84.0/24',
        '76.76.85.0/24',
        '76.76.86.0/24',
        '76.76.87.0/24',
        '76.76.88.0/24',
        '76.76.89.0/24',
        '76.76.90.0/24',
        '76.76.91.0/24',
        '76.76.92.0/24',
        '76.76.93.0/24',
        '76.76.94.0/24',
        '76.76.95.0/24',
        '76.76.96.0/24',
        '76.76.97.0/24',
        '76.76.98.0/24',
        '76.76.99.0/24',
        '76.76.100.0/24',
        '76.76.101.0/24',
        '76.76.102.0/24',
        '76.76.103.0/24',
        '76.76.104.0/24',
        '76.76.105.0/24',
        '76.76.106.0/24',
        '76.76.107.0/24',
        '76.76.108.0/24',
        '76.76.109.0/24',
        '76.76.110.0/24',
        '76.76.111.0/24',
        '76.76.112.0/24',
        '76.76.113.0/24',
        '76.76.114.0/24',
        '76.76.115.0/24',
        '76.76.116.0/24',
        '76.76.117.0/24',
        '76.76.118.0/24',
        '76.76.119.0/24',
        '76.76.120.0/24',
        '76.76.121.0/24',
        '76.76.122.0/24',
        '76.76.123.0/24',
        '76.76.124.0/24',
        '76.76.125.0/24',
        '76.76.126.0/24',
        '76.76.127.0/24',
        '76.76.128.0/24',
        '76.76.129.0/24',
        '76.76.130.0/24',
        '76.76.131.0/24',
        '76.76.132.0/24',
        '76.76.133.0/24',
        '76.76.134.0/24',
        '76.76.135.0/24',
        '76.76.136.0/24',
        '76.76.137.0/24',
        '76.76.138.0/24',
        '76.76.139.0/24',
        '76.76.140.0/24',
        '76.76.141.0/24',
        '76.76.142.0/24',
        '76.76.143.0/24',
        '76.76.144.0/24',
        '76.76.145.0/24',
        '76.76.146.0/24',
        '76.76.147.0/24',
        '76.76.148.0/24',
        '76.76.149.0/24',
        '76.76.150.0/24',
        '76.76.151.0/24',
        '76.76.152.0/24',
        '76.76.153.0/24',
        '76.76.154.0/24',
        '76.76.155.0/24',
        '76.76.156.0/24',
        '76.76.157.0/24',
        '76.76.158.0/24',
        '76.76.159.0/24',
        '76.76.160.0/24',
        '76.76.161.0/24',
        '76.76.162.0/24',
        '76.76.163.0/24',
        '76.76.164.0/24',
        '76.76.165.0/24',
        '76.76.166.0/24',
        '76.76.167.0/24',
        '76.76.168.0/24',
        '76.76.169.0/24',
        '76.76.170.0/24',
        '76.76.171.0/24',
        '76.76.172.0/24',
        '76.76.173.0/24',
        '76.76.174.0/24',
        '76.76.175.0/24',
        '76.76.176.0/24',
        '76.76.177.0/24',
        '76.76.178.0/24',
        '76.76.179.0/24',
        '76.76.180.0/24',
        '76.76.181.0/24',
        '76.76.182.0/24',
        '76.76.183.0/24',
        '76.76.184.0/24',
        '76.76.185.0/24',
        '76.76.186.0/24',
        '76.76.187.0/24',
        '76.76.188.0/24',
        '76.76.189.0/24',
        '76.76.190.0/24',
        '76.76.191.0/24',
        '76.76.192.0/24',
        '76.76.193.0/24',
        '76.76.194.0/24',
        '76.76.195.0/24',
        '76.76.196.0/24',
        '76.76.197.0/24',
        '76.76.198.0/24',
        '76.76.199.0/24',
        '76.76.200.0/24',
        '76.76.201.0/24',
        '76.76.202.0/24',
        '76.76.203.0/24',
        '76.76.204.0/24',
        '76.76.205.0/24',
        '76.76.206.0/24',
        '76.76.207.0/24',
        '76.76.208.0/24',
        '76.76.209.0/24',
        '76.76.210.0/24',
        '76.76.211.0/24',
        '76.76.212.0/24',
        '76.76.213.0/24',
        '76.76.214.0/24',
        '76.76.215.0/24',
        '76.76.216.0/24',
        '76.76.217.0/24',
        '76.76.218.0/24',
        '76.76.219.0/24',
        '76.76.220.0/24',
        '76.76.221.0/24',
        '76.76.222.0/24',
        '76.76.223.0/24',
        '76.76.224.0/24',
        '76.76.225.0/24',
        '76.76.226.0/24',
        '76.76.227.0/24',
        '76.76.228.0/24',
        '76.76.229.0/24',
        '76.76.230.0/24',
        '76.76.231.0/24',
        '76.76.232.0/24',
        '76.76.233.0/24',
        '76.76.234.0/24',
        '76.76.235.0/24',
        '76.76.236.0/24',
        '76.76.237.0/24',
        '76.76.238.0/24',
        '76.76.239.0/24',
        '76.76.240.0/24',
        '76.76.241.0/24',
        '76.76.242.0/24',
        '76.76.243.0/24',
        '76.76.244.0/24',
        '76.76.245.0/24',
        '76.76.246.0/24',
        '76.76.247.0/24',
        '76.76.248.0/24',
        '76.76.249.0/24',
        '76.76.250.0/24',
        '76.76.251.0/24',
        '76.76.252.0/24',
        '76.76.253.0/24',
        '76.76.254.0/24',
        '76.76.255.0/24',
      ];

      // Cloudflare IP ranges (official ranges)
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
        '2400:cb00::/32',
        '2606:4700::/32',
        '2803:f800::/32',
        '2405:b500::/32',
        '2405:8100::/32',
        '2a06:98c0::/29',
        '2c0f:f248::/32',
      ];

      // Check against Vercel ranges
      for (const range of vercelRanges) {
        if (this.isInCIDRRange(parsedIP, range)) {
          return true;
        }
      }

      // Check against Cloudflare ranges
      for (const range of cloudflareRanges) {
        if (this.isInCIDRRange(parsedIP, range)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      // If IP parsing fails, don't trust it
      return false;
    }
  }

  /**
   * Check if IP is within a CIDR range using ipaddr.js
   */
  private static isInCIDRRange(ip: ipaddr.IPv4 | ipaddr.IPv6, cidr: string): boolean {
    try {
      const [rangeIP, prefixLength] = cidr.split('/');
      const parsedRange = ipaddr.process(rangeIP);
      
      if (parsedIP.kind() === parsedRange.kind()) {
        return parsedIP.match(parsedRange, parseInt(prefixLength));
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if request has a valid proxy chain (for X-Real-IP validation)
   */
  private static hasValidProxyChain(request: Request): boolean {
    const forwarded = request.headers.get('x-forwarded-for');
    if (!forwarded) {
      return false;
    }

    // Check if the forwarding chain contains trusted proxies
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips.some(ip => this.isValidIP(ip) && this.isTrustedProxy(ip));
  }

  /**
   * Check if request has a valid Vercel chain (for X-Vercel-IP validation)
   */
  private static hasValidVercelChain(request: Request): boolean {
    const forwarded = request.headers.get('x-forwarded-for');
    if (!forwarded) {
      return false;
    }

    // Check if the forwarding chain contains Vercel IPs
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips.some(ip => {
      if (!this.isValidIP(ip)) return false;
      
      try {
        const parsedIP = ipaddr.process(ip);
        // Check if this is a Vercel IP
        return this.isInCIDRRange(parsedIP, '76.76.0.0/16');
      } catch {
        return false;
      }
    });
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
