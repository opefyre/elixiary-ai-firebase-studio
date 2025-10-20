import { NextRequest, NextResponse } from 'next/server';
import { generateCocktailRecipe } from '@/ai/flows/generate-cocktail-recipe';
import { SecureErrorHandler } from '@/lib/error-handler';
import { SecurityMiddleware } from '@/lib/security-middleware';
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
});

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

    // Apply CSRF protection for state-changing operations
    const csrfValidation = SecurityMiddleware.validateCSRFToken(request, process.env.NEXT_PUBLIC_APP_URL);
    if (!csrfValidation.valid) {
      return NextResponse.json(
        { error: csrfValidation.error },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedFields = requestSchema.safeParse(body);

    if (!validatedFields.success) {
      return SecureErrorHandler.handleValidationError(validatedFields.error);
    }

    const recipe = await generateCocktailRecipe(validatedFields.data);
    
    if (!recipe) {
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
    
    const response = NextResponse.json({ recipe: fixedRecipe, error: null });
    return SecurityMiddleware.addSecurityHeaders(response);
  } catch (error: any) {
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
