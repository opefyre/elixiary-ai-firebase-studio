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

    it('should ignore spoofed X-Forwarded-For headers from untrusted sources', () => {
      const request = createMockRequest({
        'x-forwarded-for': '192.168.1.100, 10.0.0.1',
      });
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('unknown');
    });

    it('should ignore spoofed X-Real-IP headers from untrusted sources', () => {
      const request = createMockRequest({
        'x-real-ip': '192.168.1.100',
      });
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('unknown');
    });

    it('should trust localhost IPs', () => {
      const request = createMockRequest({
        'x-forwarded-for': '127.0.0.1',
      });
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('127.0.0.1');
    });

    it('should trust IPv6 localhost', () => {
      const request = createMockRequest({
        'x-forwarded-for': '::1',
      });
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('127.0.0.1'); // Normalized to IPv4 localhost
    });

    it('should normalize IPv6-mapped IPv4 addresses', () => {
      const request = createMockRequest({
        'x-forwarded-for': '::ffff:192.168.1.1',
      });
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('192.168.1.1');
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

    it('should prefer Next.js request.ip when available', () => {
      const request = createMockRequest({
        'x-forwarded-for': '192.168.1.100',
      });
      // Mock Next.js request.ip
      (request as any).ip = '203.0.113.1';
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('203.0.113.1');
    });

    it('should prefer x-vercel-ip over X-Forwarded-For', () => {
      const request = createMockRequest({
        'x-forwarded-for': '192.168.1.100',
        'x-vercel-ip': '203.0.113.2',
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('203.0.113.2');
    });

    it('should handle multiple IPs in X-Forwarded-For and validate each', () => {
      const request = createMockRequest({
        'x-forwarded-for': '192.168.1.100, 127.0.0.1, 10.0.0.1',
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('127.0.0.1'); // Should find the trusted localhost IP
    });

    it('should return unknown when all IPs are from untrusted sources', () => {
      const request = createMockRequest({
        'x-forwarded-for': '192.168.1.100, 10.0.0.1, 172.16.0.1',
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('unknown');
    });
  });

  describe('IP validation edge cases', () => {
    it('should handle empty strings', () => {
      const request = createMockRequest({
        'x-forwarded-for': '',
        'x-real-ip': '',
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('unknown');
    });

    it('should handle malformed headers', () => {
      const request = createMockRequest({
        'x-forwarded-for': ',,,',
        'x-real-ip': '   ',
      });
      
      const result = AuditLogger.getClientIP(request);
      expect(result).toBe('unknown');
    });

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
          expect(result).toBe('127.0.0.1'); // Normalized
        } else {
          expect(result).toBe('unknown'); // Not trusted
        }
      });
    });
  });
});
