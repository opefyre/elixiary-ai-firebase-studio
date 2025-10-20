import { AuditLogger } from './audit-logger';

/**
 * Environment variable validation and monitoring for security
 */
export class EnvironmentValidator {
  private static readonly REQUIRED_VARS = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'GOOGLE_APPLICATION_CREDENTIALS_JSON',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'API_KEY_SECRET',
    'NEXT_PUBLIC_APP_URL'
  ];

  private static readonly SENSITIVE_VARS = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'API_KEY_SECRET',
    'GOOGLE_APPLICATION_CREDENTIALS_JSON'
  ];

  /**
   * Validate all required environment variables
   */
  static validateEnvironment(): { valid: boolean; missingVars?: string[]; warnings?: string[] } {
    const missingVars: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const varName of this.REQUIRED_VARS) {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    }

    // Check sensitive variables for proper length and format
    for (const varName of this.SENSITIVE_VARS) {
      const value = process.env[varName];
      if (value) {
        if (varName === 'API_KEY_SECRET' && value.length < 32) {
          warnings.push(`${varName} should be at least 32 characters for production security`);
        }
        
        if (varName.includes('STRIPE') && !value.startsWith('sk_') && !value.startsWith('whsec_')) {
          warnings.push(`${varName} format appears incorrect for Stripe integration`);
        }
      }
    }

    // Check NODE_ENV
    if (!process.env.NODE_ENV) {
      warnings.push('NODE_ENV is not set');
    } else if (process.env.NODE_ENV === 'production') {
      // Additional production checks
      if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.startsWith('https://')) {
        warnings.push('NEXT_PUBLIC_APP_URL should use HTTPS in production');
      }
    }

    return {
      valid: missingVars.length === 0,
      missingVars: missingVars.length > 0 ? missingVars : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Log environment security status
   */
  static async logEnvironmentStatus(): Promise<void> {
    try {
      const validation = this.validateEnvironment();
      
      if (!validation.valid || validation.warnings) {
        const auditLogger = new AuditLogger();
        const requestId = AuditLogger.generateRequestId();
        
        await auditLogger.logSecurityEvent(
          requestId,
          'authentication_failed', // Using existing event type for security logging
          {
            endpoint: 'environment-validation',
            method: 'SYSTEM',
            ipAddress: 'system',
            userAgent: 'environment-validator'
          },
          {
            errorMessage: validation.valid ? 'Environment warnings detected' : 'Missing environment variables',
            metadata: {
              missingVars: validation.missingVars,
              warnings: validation.warnings,
              nodeEnv: process.env.NODE_ENV
            }
          }
        );
      }
    } catch (error) {
      console.error('Failed to log environment status:', error);
    }
  }

  /**
   * Validate specific environment variable
   */
  static validateVariable(varName: string, value?: string): { valid: boolean; error?: string } {
    if (!value) {
      return { valid: false, error: `${varName} is not set` };
    }

    switch (varName) {
      case 'API_KEY_SECRET':
        if (value.length < 32) {
          return { valid: false, error: `${varName} must be at least 32 characters` };
        }
        break;
      
      case 'STRIPE_SECRET_KEY':
        if (!value.startsWith('sk_')) {
          return { valid: false, error: `${varName} must start with sk_` };
        }
        break;
      
      case 'STRIPE_WEBHOOK_SECRET':
        if (!value.startsWith('whsec_')) {
          return { valid: false, error: `${varName} must start with whsec_` };
        }
        break;
      
      case 'NEXT_PUBLIC_APP_URL':
        try {
          const url = new URL(value);
          if (url.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
            return { valid: false, error: `${varName} must use HTTPS in production` };
          }
        } catch {
          return { valid: false, error: `${varName} must be a valid URL` };
        }
        break;
    }

    return { valid: true };
  }

  /**
   * Get environment summary (without exposing sensitive values)
   */
  static getEnvironmentSummary(): Record<string, any> {
    const summary: Record<string, any> = {};
    
    for (const varName of this.REQUIRED_VARS) {
      const value = process.env[varName];
      if (this.SENSITIVE_VARS.includes(varName)) {
        summary[varName] = value ? `***${value.slice(-4)}` : 'NOT_SET';
      } else {
        summary[varName] = value ? 'SET' : 'NOT_SET';
      }
    }
    
    summary.NODE_ENV = process.env.NODE_ENV || 'NOT_SET';
    summary.timestamp = new Date().toISOString();
    
    return summary;
  }
}
