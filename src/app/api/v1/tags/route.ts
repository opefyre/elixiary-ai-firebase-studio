import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const authenticator = new APIAuthenticator();
    const { user, rateLimit } = await authenticator.authenticateRequest(request);
    
    const { adminDb } = initializeFirebaseServer();
    
    // Get all tags (cached for performance)
    const tagsSnapshot = await adminDb
      .collection('curated-tags')
      .orderBy('name', 'asc')
      .get();
    
    const tags = tagsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      displayName: doc.data().displayName,
      recipeCount: doc.data().recipeCount || 0
    }));
    
    return NextResponse.json(authenticator.createSuccessResponse(tags, rateLimit));
    
  } catch (error: any) {
    console.error('Error fetching tags:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
