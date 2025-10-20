import xss from 'xss';

/**
 * Advanced input sanitization utility
 */
export class InputSanitizer {
  private static readonly xssOptions = {
    whiteList: {}, // Remove all HTML tags
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
    allowCommentTag: false,
    allowList: {
      // No allowed tags or attributes
    },
    onTag: (tag: string, html: string) => {
      // Remove all tags by returning empty string
      return '';
    },
    onTagAttr: (tag: string, name: string, value: string) => {
      // Remove all attributes
      return '';
    },
    css: false, // Disable CSS filtering since we're stripping all HTML
  };

  /**
   * Sanitize string input to prevent XSS and injection attacks
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return String(input);
    }

    return input
      .trim() // Remove leading/trailing whitespace
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/data:/gi, '') // Remove data: protocol (for URIs)
      .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
      .substring(0, 10000); // Limit string length to prevent DoS
  }

  /**
   * Sanitize HTML content using XSS filter
   */
  static sanitizeHtml(html: string): string {
    if (typeof html !== 'string') {
      return '';
    }

    return xss(html, this.xssOptions);
  }

  /**
   * Sanitize object recursively
   */
  static sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize both key and value
        const sanitizedKey = this.sanitizeString(String(key));
        sanitized[sanitizedKey] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }

    return this.sanitizeString(String(obj));
  }

  /**
   * Validate and sanitize email input
   */
  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }

    return sanitized.toLowerCase();
  }

  /**
   * Validate and sanitize API key input
   */
  static sanitizeApiKey(apiKey: string): string {
    const sanitized = this.sanitizeString(apiKey);
    
    if (!sanitized.startsWith('elx_live_') || sanitized.length < 40) {
      throw new Error('Invalid API key format');
    }

    return sanitized;
  }

  /**
   * Sanitize URL input
   */
  static sanitizeUrl(url: string): string {
    const sanitized = this.sanitizeString(url);
    
    try {
      const urlObj = new URL(sanitized);
      // Only allow https URLs for security
      if (urlObj.protocol !== 'https:') {
        throw new Error('Only HTTPS URLs are allowed');
      }
      return urlObj.toString();
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  /**
   * Remove potential SQL/NoSQL injection patterns
   */
  static sanitizeForDatabase(input: string): string {
    if (typeof input !== 'string') {
      return String(input);
    }
    
    return this.sanitizeString(input)
      // SQL injection patterns
      .replace(/[';]/g, '') // Remove quotes and semicolons
      .replace(/--/g, '') // Remove SQL comment markers
      .replace(/\/\*/g, '') // Remove SQL comment start
      .replace(/\*\//g, '') // Remove SQL comment end
      // NoSQL injection patterns
      .replace(/\$where/g, '') // Remove MongoDB $where
      .replace(/\$ne/g, '') // Remove $ne operators
      .replace(/\$gt/g, '') // Remove $gt operators
      .replace(/\$regex/g, '') // Remove $regex operators
      .replace(/\{\s*\$where/g, '') // Remove $where in objects
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/this\./g, '') // Remove this. references
      .replace(/function\s*\(/g, '') // Remove function calls
      // Additional dangerous patterns
      .replace(/eval\s*\(/gi, '') // Remove eval() calls
      .replace(/exec\s*\(/gi, '') // Remove exec() calls
      .replace(/system\s*\(/gi, '') // Remove system() calls
      .trim();
  }

  /**
   * Sanitize query parameters specifically for Firestore operations
   */
  static sanitizeQueryParam(param: string, maxLength: number = 100): string {
    if (typeof param !== 'string') {
      throw new Error('Query parameter must be a string');
    }
    
    const sanitized = this.sanitizeForDatabase(param);
    
    if (sanitized.length > maxLength) {
      throw new Error(`Query parameter too long (max ${maxLength} characters)`);
    }
    
    if (sanitized !== param) {
      throw new Error('Invalid characters in query parameter');
    }
    
    return sanitized;
  }
}
