import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const authenticator = new APIAuthenticator();
    const { user, rateLimit } = await authenticator.authenticateRequest(request);
    
    const { adminDb } = initializeFirebaseServer();
    
    // Get all categories (cached for performance)
    const categoriesSnapshot = await adminDb
      .collection('curated-categories')
      .orderBy('name', 'asc')
      .get();
    
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      displayName: doc.data().displayName,
      description: doc.data().description,
      recipeCount: doc.data().recipeCount || 0
    }));
    
    return NextResponse.json(authenticator.createSuccessResponse(categories, rateLimit));
    
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
