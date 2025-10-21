import { AuditLogger } from '../audit-logger';

// Mock Request object for testing
const createMockRequest = (headers: Record<string, string> = {}): Request => {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] || null,
    },
    url: 'https://example.com/api/test',
  } as Request;
};

describe('AuditLogger IP Spoofing Protection', () => {
  describe('getClientIP', () => {
    it('should return unknown for requests without any IP headers', () => {
      const request = createMockRequest();
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('unknown');
    });

    it('should prioritize Next.js request.ip when available', () => {
      const request = createMockRequest({
        'x-forwarded-for': '192.168.1.100',
        'x-vercel-ip': '203.0.113.2',
      });
      // Mock Next.js request.ip
      (request as any).ip = '203.0.113.1';
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('203.0.113.1');
    });

    it('should reject spoofed X-Vercel-IP without valid proxy chain', () => {
      const request = createMockRequest({
        'x-vercel-ip': '203.0.113.100', // Spoofed Vercel IP
        'x-forwarded-for': '192.168.1.1', // No Vercel proxy in chain
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('unknown'); // Should reject spoofed header
    });

    it('should reject spoofed X-Real-IP without valid proxy chain', () => {
      const request = createMockRequest({
        'x-real-ip': '203.0.113.100', // Spoofed Real IP
        'x-forwarded-for': '192.168.1.1', // No trusted proxy in chain
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('unknown'); // Should reject spoofed header
    });

    it('should extract client IP from X-Forwarded-For chain', () => {
      const request = createMockRequest({
        'x-forwarded-for': '203.0.113.1, 76.76.19.1, 76.76.20.1', // Client, Vercel, Vercel
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('203.0.113.1'); // Should return first non-proxy IP
    });

    it('should return unknown when all IPs in X-Forwarded-For are from trusted proxies', () => {
      const request = createMockRequest({
        'x-forwarded-for': '76.76.19.1, 76.76.20.1', // Only Vercel IPs
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('unknown'); // Should not trust proxy-only chain
    });

    it('should trust X-Vercel-IP only with valid Vercel proxy chain', () => {
      const request = createMockRequest({
        'x-vercel-ip': '203.0.113.100',
        'x-forwarded-for': '203.0.113.1, 76.76.19.1', // Client + Vercel proxy
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('203.0.113.100'); // Should trust with valid chain
    });

    it('should trust X-Real-IP only with valid proxy chain', () => {
      const request = createMockRequest({
        'x-real-ip': '203.0.113.100',
        'x-forwarded-for': '203.0.113.1, 173.245.48.1', // Client + Cloudflare proxy
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('203.0.113.100'); // Should trust with valid chain
    });

    it('should reject invalid IP formats', () => {
      const invalidIPs = [
        'not-an-ip',
        '999.999.999.999',
        '192.168.1',
        '192.168.1.1.1',
        'invalid:ipv6',
      ];

      invalidIPs.forEach(invalidIP => {
        const request = createMockRequest({
          'x-forwarded-for': invalidIP,
        });
        const result = AuditLogger.getClientIP(request);
        expect(result).toBe('unknown');
      });
    });

    it('should normalize IPv6-mapped IPv4 addresses', () => {
      const request = createMockRequest({
        'x-forwarded-for': '::ffff:192.168.1.1',
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('192.168.1.1');
    });

    it('should normalize IPv6 localhost to IPv4', () => {
      const request = createMockRequest({
        'x-forwarded-for': '::1',
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('127.0.0.1');
    });

    it('should handle empty and malformed headers', () => {
      const malformedHeaders = [
        { 'x-forwarded-for': '' },
        { 'x-forwarded-for': ',,,' },
        { 'x-real-ip': '   ' },
        { 'x-vercel-ip': '' },
      ];

      malformedHeaders.forEach(headers => {
        const request = createMockRequest(headers);
        const result = AuditLogger.getClientIP(request);
        expect(result).toBe('unknown');
      });
    });

    it('should identify Vercel proxy IPs correctly', () => {
      const vercelIPs = [
        '76.76.19.1',
        '76.76.100.50',
        '76.76.255.254',
      ];

      vercelIPs.forEach(ip => {
        const request = createMockRequest({
          'x-forwarded-for': ip,
        });
        const result = AuditLogger.getClientIP(request);
        expect(result).toBe('unknown'); // Vercel IPs should be filtered out
      });
    });

    it('should identify Cloudflare proxy IPs correctly', () => {
      const cloudflareIPs = [
        '173.245.48.1',
        '103.21.244.1',
        '104.16.0.1',
      ];

      cloudflareIPs.forEach(ip => {
        const request = createMockRequest({
          'x-forwarded-for': ip,
        });
        const result = AuditLogger.getClientIP(request);
        expect(result).toBe('unknown'); // Cloudflare IPs should be filtered out
      });
    });

    it('should handle complex proxy chains correctly', () => {
      const request = createMockRequest({
        'x-forwarded-for': '203.0.113.1, 76.76.19.1, 173.245.48.1, 104.16.0.1',
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('203.0.113.1'); // Should return first non-proxy IP
    });

    it('should prevent rate limiting bypass through header spoofing', () => {
      // Simulate attacker trying to bypass rate limits with spoofed headers
      const spoofedRequests = [
        createMockRequest({
          'x-vercel-ip': '192.168.1.100',
          'x-forwarded-for': '10.0.0.1',
        }),
        createMockRequest({
          'x-real-ip': '192.168.1.101',
          'x-forwarded-for': '10.0.0.2',
        }),
        createMockRequest({
          'x-vercel-ip': '192.168.1.102',
          'x-real-ip': '192.168.1.103',
          'x-forwarded-for': '10.0.0.3',
        }),
      ];

      spoofedRequests.forEach((request, index) => {
        const result = AuditLogger.getClientIP(request);
        expect(result).toBe('unknown'); // All spoofed requests should be rejected
      });
    });

    it('should provide consistent results for legitimate requests', () => {
      const legitimateRequest = createMockRequest({
        'x-forwarded-for': '203.0.113.1, 76.76.19.1',
      });
      
      // Multiple calls should return the same result
      const result1 = AuditLogger.getClientIP(legitimateRequest);
      const result2 = AuditLogger.getClientIP(legitimateRequest);
      const result3 = AuditLogger.getClientIP(legitimateRequest);
      
      expect(result1).toBe('203.0.113.1');
      expect(result2).toBe('203.0.113.1');
      expect(result3).toBe('203.0.113.1');
    });
  });

  describe('Security edge cases', () => {
    it('should handle IPv6 addresses correctly', () => {
      const validIPv6s = [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        '::1',
        '::',
        '2001:db8::8a2e:370:7334',
      ];

      validIPv6s.forEach(ipv6 => {
        const request = createMockRequest({
          'x-forwarded-for': ipv6,
        });
        const result = AuditLogger.getClientIP(request);
        if (ipv6 === '::1') {
          expect(result).toBe('127.0.0.1'); // Normalized to IPv4 localhost
        } else {
          expect(result).toBe('unknown'); // Not trusted without valid proxy chain
        }
      });
    });

    it('should handle mixed IPv4 and IPv6 in forwarding chain', () => {
      const request = createMockRequest({
        'x-forwarded-for': '203.0.113.1, 2001:0db8:85a3::1, 76.76.19.1',
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('203.0.113.1'); // Should return first valid client IP
    });

    it('should reject requests with suspicious header patterns', () => {
      const suspiciousRequests = [
        createMockRequest({
          'x-forwarded-for': '127.0.0.1, 192.168.1.1', // Localhost spoofing
        }),
        createMockRequest({
          'x-vercel-ip': '127.0.0.1',
        }),
        createMockRequest({
          'x-real-ip': '0.0.0.0',
        }),
      ];

      suspiciousRequests.forEach(request => {
        const result = AuditLogger.getClientIP(request);
        expect(result).toBe('unknown'); // Should reject suspicious patterns
      });
    });
  });
});
