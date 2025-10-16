import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { initializeFirebaseServer } from '@/firebase/server';
import { z } from 'zod';

const recipeQuerySchema = z.object({
  category: z.string().optional().max(50),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  search: z.string().optional().max(100),
  tags: z.string().optional().max(200),
  page: z.number().int().min(1).max(100).default(1),
  limit: z.number().int().min(1).max(20).default(10)
});

export async function GET(request: NextRequest) {
  try {
    const authenticator = new APIAuthenticator();
    const { user, rateLimit } = await authenticator.authenticateRequest(request);
    
    // Validate request size
    authenticator.validateRequestSize(request);
    
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      category: searchParams.get('category') || undefined,
      difficulty: searchParams.get('difficulty') as 'Easy' | 'Medium' | 'Hard' || undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    };
    
    const validatedParams = recipeQuerySchema.parse(queryParams);
    
    // Sanitize input
    const sanitizedParams = authenticator.sanitizeInput(validatedParams);
    
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
    
    // Apply limit for performance
    query = query.limit(sanitizedParams.limit * 3); // Get more than needed for client-side filtering
    
    const snapshot = await query.get();
    let recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Apply client-side filters for complex queries (tags, search)
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
    
    // Apply pagination
    const total = recipes.length;
    const offset = (sanitizedParams.page - 1) * sanitizedParams.limit;
    const paginatedRecipes = recipes.slice(offset, offset + sanitizedParams.limit);
    
    // Remove sensitive fields
    const safeRecipes = paginatedRecipes.map(recipe => ({
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
    
    return NextResponse.json(authenticator.createSuccessResponse(response, rateLimit));
    
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}
