import { NextResponse } from 'next/server';
import { APIError } from '@/types/api';
import { AuditLogger } from './audit-logger';

export interface SecureErrorResponse {
  success: false;
  error: string;
  requestId?: string;
  timestamp?: string;
}

/**
 * Centralized error handling for API routes to prevent information disclosure
 */
export class SecureErrorHandler {
  /**
   * Create a secure error response that doesn't expose sensitive information
   */
  static createErrorResponse(
    error: unknown,
    requestId?: string,
    defaultMessage: string = 'An error occurred'
  ): NextResponse<SecureErrorResponse> {
    let statusCode = 500;
    let message = defaultMessage;

    if (error instanceof APIError) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (error instanceof Error) {
      // Only expose safe error messages
      if (this.isSafeErrorMessage(error.message)) {
        message = error.message;
      }
    }

    const response: SecureErrorResponse = {
      success: false,
      error: message,
      requestId,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: statusCode });
  }

  /**
   * Check if an error message is safe to expose (doesn't contain sensitive information)
   */
  private static isSafeErrorMessage(message: string): boolean {
    const unsafePatterns = [
      /password/i,
      /token/i,
      /key/i,
      /secret/i,
      /credential/i,
      /auth.*key/i,
      /firebase/i,
      /database/i,
      /sql/i,
      /connection.*string/i,
      /uri.*mongodb/i,
      /redis/i,
      /aws/i,
      /access.*key/i,
      /private.*key/i,
      /stack.*trace/i,
      /file.*path/i,
      /\/[a-zA-Z]:\//, // File paths
      /\.env/i,
      /config/i,
      /environment/i,
      /process\.env/i
    ];

    return !unsafePatterns.some(pattern => pattern.test(message));
  }

  /**
   * Log error for security monitoring without exposing details
   */
  static async logSecurityError(
    error: unknown,
    requestId: string,
    context: {
      endpoint: string;
      method: string;
      ipAddress: string;
      userAgent?: string;
      userId?: string;
    }
  ): Promise<void> {
    try {
      const auditLogger = new AuditLogger();
      
      // Determine error type for security logging
      let eventType: 'api_error' | 'authentication_failed' = 'api_error';
      
      if (error instanceof APIError) {
        if (error.statusCode >= 400 && error.statusCode < 500) {
          eventType = 'authentication_failed';
        }
      }

      await auditLogger.logSecurityEvent(
        requestId,
        eventType,
        {
          endpoint: context.endpoint,
          method: context.method,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent
        },
        {
          userId: context.userId,
          statusCode: error instanceof APIError ? error.statusCode : 500,
          errorMessage: error instanceof Error ? error.constructor.name : 'Unknown error'
        }
      );
    } catch (loggingError) {
      // Don't fail the response if logging fails
    }
  }

  /**
   * Handle Zod validation errors securely
   */
  static handleValidationError(error: any): NextResponse<SecureErrorResponse> {
    if (error.name === 'ZodError' && error.errors) {
      // Only expose field names, not values or detailed paths
      const fieldErrors = error.errors.map((err: any) => `${err.path.join('.')} validation failed`);
      
      return NextResponse.json({
        success: false,
        error: 'Invalid input data',
        details: fieldErrors
      }, { status: 400 });
    }

    return this.createErrorResponse(error);
  }

  /**
   * Handle database/Firestore errors securely
   */
  static handleDatabaseError(error: any): NextResponse<SecureErrorResponse> {
    if (error.code === 'permission-denied') {
      return NextResponse.json({
        success: false,
        error: 'Access denied'
      }, { status: 403 });
    }

    if (error.code === 'not-found') {
      return NextResponse.json({
        success: false,
        error: 'Resource not found'
      }, { status: 404 });
    }

    if (error.code === 'already-exists') {
      return NextResponse.json({
        success: false,
        error: 'Resource already exists'
      }, { status: 409 });
    }

    // Don't expose database-specific errors
    return NextResponse.json({
      success: false,
      error: 'Database operation failed'
    }, { status: 500 });
  }
}
