import { createHash, createHmac, timingSafeEqual } from 'crypto';

/**
 * Cryptographic utility functions for secure storage and validation
 */
export class CryptoUtils {
  private static readonly SECRET_KEY = (() => {
    const secret = process.env.API_KEY_SECRET;
    if (!secret) {
      throw new Error('API_KEY_SECRET environment variable is required but not set');
    }
    if (process.env.NODE_ENV === 'production' && secret.length < 32) {
      throw new Error('API_KEY_SECRET must be at least 32 characters in production');
    }
    return secret;
  })();

  /**
   * Hash an API key for secure storage
   */
  static hashAPIKey(apiKey: string): string {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Invalid API key');
    }
    
    // Use HMAC with SHA-256 for secure hashing
    const hmac = createHmac('sha256', this.SECRET_KEY);
    hmac.update(apiKey);
    return hmac.digest('hex');
  }

  /**
   * Generate a secure API key ID based on the key content
   */
  static generateAPIKeyId(apiKey: string): string {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Invalid API key');
    }
    
    // Create a hash that can be used as a document ID
    const hash = createHash('sha256');
    hash.update(apiKey + this.SECRET_KEY);
    return hash.digest('hex').substring(0, 32); // Use first 32 chars as ID
  }

  /**
   * Securely compare API key with stored hash (constant time)
   */
  static verifyAPIKey(apiKey: string, storedHash: string): boolean {
    if (!apiKey || !storedHash) {
      return false;
    }

    try {
      const computedHash = this.hashAPIKey(apiKey);
      
      // Use timing-safe comparison to prevent timing attacks
      if (computedHash.length !== storedHash.length) {
        return false;
      }

      const computedBuffer = Buffer.from(computedHash, 'hex');
      const storedBuffer = Buffer.from(storedHash, 'hex');
      
      return timingSafeEqual(computedBuffer, storedBuffer);
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a secure random token
   */
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    // Use crypto.randomBytes for secure random generation
    const randomValues = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
    } else {
      // Fallback for server-side
      const crypto = require('crypto');
      const bytes = crypto.randomBytes(length);
      for (let i = 0; i < length; i++) {
        randomValues[i] = bytes[i];
      }
    }
    
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    
    return result;
  }

  /**
   * Hash sensitive data (like email) for lookup purposes
   */
  static hashForLookup(data: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid data for hashing');
    }
    
    const hash = createHash('sha256');
    hash.update(data.toLowerCase().trim() + this.SECRET_KEY);
    return hash.digest('hex');
  }
}
