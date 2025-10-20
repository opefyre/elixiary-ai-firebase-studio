import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { initializeFirebaseServer } from '@/firebase/server';

export async function DELETE(
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
    
    // Check if recipe exists and belongs to user
    const recipeDoc = await adminDb.collection('user-saved-recipes').doc(id).get();
    
    if (!recipeDoc.exists) {
      throw new APIError('Recipe not found', 'The specified saved recipe does not exist', 404);
    }
    
    const recipe = recipeDoc.data();
    if (recipe.userId !== user.uid) {
      throw new APIError('Unauthorized', 'You can only delete your own saved recipes', 403);
    }
    
    // Delete the recipe
    await adminDb.collection('user-saved-recipes').doc(id).delete();
    
    const response = {
      message: 'Recipe removed successfully',
      recipeId: recipe.recipeId,
      recipeName: recipe.recipeName
    };
    
    return NextResponse.json(authenticator.createSuccessResponse(response, rateLimit));
    
  } catch (error: any) {
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
