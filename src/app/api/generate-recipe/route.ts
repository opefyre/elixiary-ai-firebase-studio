import { NextRequest, NextResponse } from 'next/server';
import { generateCocktailRecipe } from '@/ai/flows/generate-cocktail-recipe';
import { SecureErrorHandler } from '@/lib/error-handler';
import { SecurityMiddleware } from '@/lib/security-middleware';
import { verifyFirebaseToken } from '@/lib/firebase-auth-verify';
import { APIAuthenticator } from '@/lib/api-auth';
import { RateLimiter } from '@/lib/rate-limiter';
import { AuditLogger } from '@/lib/audit-logger';
import { z } from 'zod';

const requestSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long')
    .refine((val) => {
      // Prevent potential injection patterns
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:/i,
        /vbscript:/i
      ];
      return !suspiciousPatterns.some(pattern => pattern.test(val));
    }, 'Invalid characters in prompt'),
  customization: z.object({
    complexity: z.enum(['simple', 'moderate', 'complex']).optional(),
    dietary: z.array(z.string()).optional(),
    alcoholLevel: z.enum(['low', 'medium', 'strong']).optional(),
    sweetness: z.enum(['dry', 'balanced', 'sweet']).optional(),
    flavorProfile: z.array(z.string()).optional(),
    occasion: z.string().optional(),
    season: z.string().optional(),
    restrictions: z.string().optional(),
  }).optional(),
});

/**
 * Authenticate request using either Firebase token or API key
 */
async function authenticateRequest(request: NextRequest): Promise<{
  user: any;
  authType: 'firebase' | 'api_key';
  rateLimitKey: string;
}> {
  // Check for API key authentication first (for API clients)
  const apiKey = request.headers.get('x-api-key');
  const userEmail = request.headers.get('x-user-email');
  
  if (apiKey && userEmail) {
    // API key authentication
    const authenticator = new APIAuthenticator();
    const { user, apiKey: validatedApiKey, rateLimit } = await authenticator.authenticateRequest(request);
    
    return {
      user: {
        uid: user.uid || user.id,
        email: user.email || userEmail,
        subscriptionTier: user.subscriptionTier || 'free',
        isApiKey: true
      },
      authType: 'api_key',
      rateLimitKey: `api_key:${validatedApiKey.id}`
    };
  }
  
  // Fall back to Firebase token authentication (for web clients)
  const authHeader = request.headers.get('authorization');
  const { user, error: authError } = await verifyFirebaseToken(authHeader);
  
  if (!user) {
    throw new Error(authError || 'Authentication required. Provide either Firebase ID token or API key.');
  }
  
  return {
    user: {
      uid: user.uid,
      email: user.email,
      subscriptionTier: 'free', // Will be determined from user data if needed
      isApiKey: false
    },
    authType: 'firebase',
    rateLimitKey: `firebase:${user.uid}`
  };
}

export async function POST(request: NextRequest) {
  try {
    // Apply security middleware validation
    const requestValidation = SecurityMiddleware.validateRequestSizeAndType(request);
    if (!requestValidation.valid) {
      return NextResponse.json(
        { error: requestValidation.error },
        { status: requestValidation.error?.includes('too large') ? 413 : 400 }
      );
    }

    // Authenticate the request using proper authentication (Firebase token or API key)
    let user, authType, rateLimitKey;
    try {
      const authResult = await authenticateRequest(request);
      user = authResult.user;
      authType = authResult.authType;
      rateLimitKey = authResult.rateLimitKey;
    } catch (authError: any) {
      return NextResponse.json(
        { error: authError.message || 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Additional CSRF protection only for Firebase auth (API keys don't need CSRF)
    if (authType === 'firebase') {
      const csrfValidation = SecurityMiddleware.validateCSRFToken(request, process.env.NEXT_PUBLIC_APP_URL);
      if (!csrfValidation.valid) {
        return NextResponse.json(
          { error: csrfValidation.error },
          { status: 403 }
        );
      }
    }

    // Apply rate limiting tied to authenticated user/API key
    const rateLimiter = new RateLimiter();
    const clientIP = AuditLogger.getClientIP(request);
    const rateLimitCheck = await rateLimiter.checkRateLimit(user.uid, clientIP);
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: rateLimitCheck.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitCheck.retryAfter?.toString() || '60'
          }
        }
      );
    }

    // Log the AI generation request for audit purposes
    const auditLogger = new AuditLogger();
    const requestId = AuditLogger.getRequestId(request);
    const startTime = Date.now();
    
    try {
      await auditLogger.logAPIRequest(
        requestId,
        {
          userId: user.uid,
          email: user.email,
          endpoint: '/api/generate-recipe',
          method: 'POST',
          ipAddress: AuditLogger.getClientIP(request),
          userAgent: request.headers.get('user-agent') ?? undefined
        },
        {
          statusCode: 200,
          responseTime: Date.now() - startTime
        },
        { prompt: 'AI generation requested', authType }
      );
    } catch (error) {
      // Don't fail the request if audit logging fails
      console.error('Audit logging failed:', error);
    }

    const body = await request.json();
    const validatedFields = requestSchema.safeParse(body);

    if (!validatedFields.success) {
      return SecureErrorHandler.handleValidationError(validatedFields.error);
    }

    const recipe = await generateCocktailRecipe(validatedFields.data);
    
    if (!recipe) {
      // Log failed AI generation
      try {
        await auditLogger.logSecurityEvent(
          requestId,
          'authentication_failed', // Using existing event type
          {
            endpoint: '/api/generate-recipe',
            method: 'POST',
            ipAddress: AuditLogger.getClientIP(request),
            userAgent: request.headers.get('user-agent') ?? undefined
          },
          {
            userId: user.uid,
            email: user.email,
            errorMessage: 'AI did not return a recipe',
            statusCode: 500,
            metadata: { authType }
          }
        );
      } catch (error) {
        console.error('Audit logging failed:', error);
      }
      
      return NextResponse.json(
        { error: 'The AI did not return a recipe. Please try a different prompt.' },
        { status: 500 }
      );
    }
    
    // Fix: Convert literal \n to actual newlines
    const fixedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients?.replace(/\\n/g, '\n'),
      instructions: recipe.instructions?.replace(/\\n/g, '\n'),
      garnish: recipe.garnish?.replace(/\\n/g, '\n'),
      ...(('tips' in recipe && recipe.tips) && {
        tips: recipe.tips.replace(/\\n/g, '\n')
      }),
    };

    // Log successful AI generation
    try {
      await auditLogger.logAPIRequest(
        requestId,
        {
          userId: user.uid,
          email: user.email,
          endpoint: '/api/generate-recipe',
          method: 'POST',
          ipAddress: AuditLogger.getClientIP(request),
          userAgent: request.headers.get('user-agent') ?? undefined
        },
        {
          statusCode: 200,
          responseTime: Date.now() - startTime
        },
        { 
          prompt: 'AI generation completed successfully',
          recipeName: fixedRecipe.name || 'Unknown',
          requestId,
          authType
        }
      );
    } catch (error) {
      console.error('Audit logging failed:', error);
    }
    
    const response = NextResponse.json({ 
      recipe: fixedRecipe, 
      error: null,
      requestId,
      authType: authType // Include auth type for client reference
    });
    return SecurityMiddleware.addSecurityHeaders(response);
  } catch (error: any) {
    // Handle authentication errors specifically
    if (error.message?.includes('Authentication required') || error.message?.includes('Invalid') && error.message?.includes('token')) {
      return NextResponse.json(
        { 
          error: 'Authentication required. Please provide a valid Firebase ID token or API key.',
          recipe: null 
        },
        { status: 401 }
      );
    }

    // Handle rate limit errors
    if (error.message?.includes('Rate limit')) {
      return NextResponse.json(
        { 
          error: error.message,
          recipe: null 
        },
        { status: 429 }
      );
    }

    const secureResponse = SecureErrorHandler.createErrorResponse(error, undefined, 'Failed to generate recipe');
    const responseBody = await secureResponse.json();
    return NextResponse.json(
      { 
        error: responseBody.error,
        recipe: null 
      },
      { status: secureResponse.status }
    );
  }
}
