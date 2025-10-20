import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { EnvironmentValidator } from './environment-validator';

/**
 * Cryptographic utility functions for secure storage and validation
 */
export class CryptoUtils {
  private static _secretKey: string | null = null;

  private static get SECRET_KEY(): string {
    if (this._secretKey === null) {
      const secret = process.env.API_KEY_SECRET;
      
      // During build time or when secret is not available, return a placeholder
      // This prevents build failures while maintaining security at runtime
      if (!secret) {
        // Only throw error if we're actually trying to use it at runtime
        if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
          throw new Error('API_KEY_SECRET environment variable is required');
        }
        this._secretKey = 'build-time-placeholder';
      } else {
        this._secretKey = secret;
      }
    }
    return this._secretKey;
  }

  // Add a runtime validation method that can be called explicitly when needed
  static validateSecretKey(): void {
    const secret = process.env.API_KEY_SECRET;
    if (!secret) {
      throw new Error('API_KEY_SECRET environment variable is not set');
    }
    
    // Only validate format during actual runtime
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        const envValidation = EnvironmentValidator.validateVariable('API_KEY_SECRET', secret);
        if (!envValidation.valid) {
          throw new Error(`Environment validation failed: ${envValidation.error}`);
        }
      } catch (error) {
        throw error;
      }
    }
  }

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
