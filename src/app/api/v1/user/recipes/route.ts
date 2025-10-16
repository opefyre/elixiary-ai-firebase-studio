import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { initializeFirebaseServer } from '@/firebase/server';
import { z } from 'zod';

const userRecipeQuerySchema = z.object({
  source: z.enum(['curated', 'ai']).optional(),
  category: z.string().optional().max(50),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
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
      source: searchParams.get('source') as 'curated' | 'ai' || undefined,
      category: searchParams.get('category') || undefined,
      difficulty: searchParams.get('difficulty') as 'Easy' | 'Medium' | 'Hard' || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    };
    
    const validatedParams = userRecipeQuerySchema.parse(queryParams);
    
    // Sanitize input
    const sanitizedParams = authenticator.sanitizeInput(validatedParams);
    
    const { adminDb } = initializeFirebaseServer();
    
    // Build optimized query using indexes
    let query = adminDb
      .collection('user-saved-recipes')
      .where('userId', '==', user.uid);
    
    // Apply source filter if provided
    if (sanitizedParams.source) {
      query = query.where('source', '==', sanitizedParams.source);
    }
    
    // Order by savedAt using the composite index
    query = query.orderBy('savedAt', 'desc');
    
    // Apply limit for performance
    query = query.limit(sanitizedParams.limit * 2); // Get more than needed for filtering
    
    const snapshot = await query.get();
    let savedRecipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Apply additional filters
    if (sanitizedParams.category) {
      savedRecipes = savedRecipes.filter(recipe => 
        recipe.category === sanitizedParams.category
      );
    }
    
    if (sanitizedParams.difficulty) {
      savedRecipes = savedRecipes.filter(recipe => 
        recipe.difficulty === sanitizedParams.difficulty
      );
    }
    
    // Apply pagination
    const total = savedRecipes.length;
    const offset = (sanitizedParams.page - 1) * sanitizedParams.limit;
    const paginatedRecipes = savedRecipes.slice(offset, offset + sanitizedParams.limit);
    
    // Remove sensitive fields
    const safeRecipes = paginatedRecipes.map(recipe => ({
      id: recipe.id,
      recipeId: recipe.recipeId,
      recipeName: recipe.recipeName,
      category: recipe.category,
      difficulty: recipe.difficulty,
      source: recipe.source,
      savedAt: recipe.savedAt
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
    console.error('Error fetching user recipes:', error);
    
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
      { success: false, error: 'Failed to fetch user recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticator = new APIAuthenticator();
    const { user, rateLimit } = await authenticator.authenticateRequest(request);
    
    // Validate request size
    authenticator.validateRequestSize(request);
    
    const body = await request.json();
    const { recipeId } = body;
    
    if (!recipeId || typeof recipeId !== 'string') {
      throw new APIError('Invalid recipe ID', 'Recipe ID is required and must be a string', 400);
    }
    
    const { adminDb } = initializeFirebaseServer();
    
    // Check if recipe exists
    const recipeDoc = await adminDb.collection('curated-recipes').doc(recipeId).get();
    if (!recipeDoc.exists) {
      throw new APIError('Recipe not found', 'The specified recipe does not exist', 404);
    }
    
    const recipe = recipeDoc.data();
    
    // Check if already saved
    const existingDoc = await adminDb
      .collection('user-saved-recipes')
      .where('userId', '==', user.uid)
      .where('recipeId', '==', recipeId)
      .limit(1)
      .get();
    
    if (!existingDoc.empty) {
      throw new APIError('Recipe already saved', 'This recipe is already in your collection', 409);
    }
    
    // Save recipe
    const savedRecipe = {
      userId: user.uid,
      recipeId,
      recipeName: recipe.name,
      category: recipe.category,
      difficulty: recipe.difficulty,
      source: 'curated',
      savedAt: new Date(),
      createdAt: new Date()
    };
    
    const docRef = await adminDb.collection('user-saved-recipes').add(savedRecipe);
    
    const response = {
      id: docRef.id,
      message: 'Recipe saved successfully',
      recipe: {
        id: recipeId,
        name: recipe.name,
        category: recipe.category,
        difficulty: recipe.difficulty
      }
    };
    
    return NextResponse.json(authenticator.createSuccessResponse(response, rateLimit));
    
  } catch (error: any) {
    console.error('Error saving recipe:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to save recipe' },
      { status: 500 }
    );
  }
}
