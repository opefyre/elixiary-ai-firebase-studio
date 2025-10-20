import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticator = new APIAuthenticator();
    const { user, rateLimit } = await authenticator.authenticateRequest(request);
    
    const { id } = await params;
    
    // Validate ID format
    if (!id || typeof id !== 'string' || id.length < 1) {
      throw new APIError('Invalid recipe ID', 'Recipe ID must be a valid string', 400);
    }
    
    const { adminDb } = initializeFirebaseServer();
    
    // Get specific recipe
    const recipeDoc = await adminDb.collection('curated-recipes').doc(id).get();
    
    if (!recipeDoc.exists) {
      throw new APIError('Recipe not found', 'The requested recipe does not exist', 404);
    }
    
    const recipe = recipeDoc.data();
    
    // Remove sensitive fields
    const safeRecipe = {
      id: recipeDoc.id,
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
    };
    
    return NextResponse.json(authenticator.createSuccessResponse(safeRecipe, rateLimit));
    
  } catch (error: any) {
    console.error('Error fetching recipe:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}
