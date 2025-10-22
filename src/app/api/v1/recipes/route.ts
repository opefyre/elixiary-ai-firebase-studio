import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { SecureErrorHandler } from '@/lib/error-handler';
import { SecurityMiddleware } from '@/lib/security-middleware';
import { InputSanitizer } from '@/lib/input-sanitizer';
import { initializeFirebaseServer } from '@/firebase/server';
import { CacheManager } from '@/lib/redis';
import RequestDeduplicator from '@/lib/request-deduplicator';
import { z } from 'zod';

const recipeQuerySchema = z.object({
  category: z.string().max(50).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  search: z.string().max(100).optional(),
  tags: z.string().max(200).optional(),
  page: z.number().int().min(1).max(100).default(1),
  limit: z.number().int().min(1).max(20).default(10)
});

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return SecurityMiddleware.handleCorsPreflight(request);
}

export async function GET(request: NextRequest) {
  try {
    // Apply security middleware
    const requestValidation = SecurityMiddleware.validateRequestSizeAndType(request);
    if (!requestValidation.valid) {
      return NextResponse.json(
        { success: false, error: requestValidation.error },
        { status: 400 }
      );
    }

    const authenticator = new APIAuthenticator();
    const { user, rateLimit } = await authenticator.authenticateRequest(request);
    
    // Validate request size
    authenticator.validateRequestSize(request);
    
    // Parse and validate query parameters with proper sanitization
    const { searchParams } = new URL(request.url);
    
    // SECURITY: Sanitize query parameters before validation to prevent injection
    const safeQueryParams = {
      category: searchParams.get('category') ? InputSanitizer.sanitizeQueryParam(searchParams.get('category')!, 50) : undefined,
      difficulty: searchParams.get('difficulty') ? InputSanitizer.sanitizeQueryParam(searchParams.get('difficulty')!, 10) as 'Easy' | 'Medium' | 'Hard' : undefined,
      search: searchParams.get('search') ? InputSanitizer.sanitizeQueryParam(searchParams.get('search')!, 100) : undefined,
      tags: searchParams.get('tags') ? InputSanitizer.sanitizeQueryParam(searchParams.get('tags')!, 200) : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    };
    
    const validatedParams = recipeQuerySchema.parse(safeQueryParams);
    
    // Additional sanitization
    const sanitizedParams = authenticator.sanitizeInput(validatedParams);
    
    // Create cache key (include user ID for personalized caching)
    const cacheKey = `v1-recipes:${user.userId}:${JSON.stringify({
      page: sanitizedParams.page,
      limit: sanitizedParams.limit,
      category: sanitizedParams.category,
      difficulty: sanitizedParams.difficulty,
      search: sanitizedParams.search,
      tags: sanitizedParams.tags
    })}`;

    // Check cache first
    const cached = await CacheManager.get(cacheKey);
    if (cached) {
      const cachedResponse = JSON.parse(cached);
      const responseJson = NextResponse.json(authenticator.createSuccessResponse(cachedResponse, rateLimit));
      return SecurityMiddleware.addSecurityHeaders(responseJson);
    }

    // Use request deduplication to prevent duplicate processing
    const deduplicator = RequestDeduplicator.getInstance();
    const dedupKey = RequestDeduplicator.createCacheKey('v1-recipes', {
      page: sanitizedParams.page,
      limit: sanitizedParams.limit,
      category: sanitizedParams.category,
      difficulty: sanitizedParams.difficulty,
      search: sanitizedParams.search,
      tags: sanitizedParams.tags
    }, user.userId);

    const response = await deduplicator.deduplicate(dedupKey, async () => {
      const { adminDb } = initializeFirebaseServer();
    
    // Build optimized query using indexes
    let query = adminDb.collection('curated-recipes');
    
    // Apply indexed filters first (most selective)
    if (sanitizedParams.category) {
      query = query.where('category', '==', sanitizedParams.category);
    }
    
    if (sanitizedParams.difficulty) {
      query = query.where('difficulty', '==', sanitizedParams.difficulty);
    }
    
    // Order by indexed field for consistent pagination
    query = query.orderBy('name', 'asc');
    
    // Apply pagination BEFORE fetching (server-side pagination)
    const offset = (sanitizedParams.page - 1) * sanitizedParams.limit;
    query = query.offset(offset).limit(sanitizedParams.limit);
    
    const snapshot = await query.get();
    let recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Apply client-side filters for complex queries (tags, search)
    // Note: This now only filters the small paginated result set
    if (sanitizedParams.tags) {
      const tagArray = sanitizedParams.tags.split(',').map(tag => tag.trim());
      recipes = recipes.filter(recipe => 
        tagArray.some(tag => recipe.tags && recipe.tags.includes(tag))
      );
    }
    
    if (sanitizedParams.search) {
      const searchLower = sanitizedParams.search.toLowerCase();
      recipes = recipes.filter(recipe => {
        const name = recipe.name?.toLowerCase() || '';
        const ingredients = recipe.ingredients?.toLowerCase() || '';
        const tags = recipe.tags?.join(' ').toLowerCase() || '';
        const category = recipe.category?.toLowerCase() || '';
        
        const searchText = `${name} ${ingredients} ${tags} ${category}`;
        return searchText.includes(searchLower);
      });
    }
    
    // For pagination info, we need to get total count separately
    // This is a limitation of server-side pagination with client-side filtering
    const totalQuery = adminDb.collection('curated-recipes');
    if (sanitizedParams.category) {
      totalQuery.where('category', '==', sanitizedParams.category);
    }
    if (sanitizedParams.difficulty) {
      totalQuery.where('difficulty', '==', sanitizedParams.difficulty);
    }
    const totalSnapshot = await totalQuery.get();
    const total = totalSnapshot.size;
    
    // Remove sensitive fields
    const safeRecipes = recipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      glassware: recipe.glassware,
      garnish: recipe.garnish,
      difficulty: recipe.difficulty,
      category: recipe.category,
      tags: recipe.tags,
      imageUrl: recipe.imageUrl,
      createdAt: recipe.createdAt
    }));
    
      const response = {
        recipes: safeRecipes,
        pagination: {
          page: sanitizedParams.page,
          limit: sanitizedParams.limit,
          total,
          totalPages: Math.ceil(total / sanitizedParams.limit),
          hasNext: sanitizedParams.page * sanitizedParams.limit < total,
          hasPrev: sanitizedParams.page > 1
        }
      };
      
      // Cache the response for 5 minutes
      await CacheManager.set(cacheKey, JSON.stringify(response), 300);
      
      return response;
    });
    
    const responseJson = NextResponse.json(authenticator.createSuccessResponse(response, rateLimit));
    return SecurityMiddleware.addSecurityHeaders(responseJson);
    
  } catch (error: any) {
    if (error instanceof APIError) {
      // SECURITY: Don't expose detailed error messages
      return NextResponse.json(
        { success: false, error: 'Request failed' },
        { status: error.statusCode }
      );
    }
    
    if (error.name === 'ZodError') {
      return SecureErrorHandler.handleValidationError(error);
    }
    
    // SECURITY: Use secure error handler to prevent information disclosure
    return SecureErrorHandler.createErrorResponse(error, undefined, 'Failed to fetch recipes');
  }
}
