import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator } from '@/lib/api-auth';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing recipes endpoint...');
    
    // Test authentication
    const authenticator = new APIAuthenticator();
    const { user, rateLimit } = await authenticator.authenticateRequest(request);
    console.log('Authentication successful');
    
    // Test Firebase connection
    const { adminDb } = initializeFirebaseServer();
    console.log('Firebase initialized');
    
    // Test simple query
    const query = adminDb.collection('curated-recipes').limit(2);
    console.log('Query created, executing...');
    
    const snapshot = await query.get();
    console.log('Query executed, docs count:', snapshot.size);
    
    const recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      category: doc.data().category
    }));
    
    console.log('Recipes processed:', recipes.length);
    
    return NextResponse.json({
      success: true,
      message: 'Recipes test successful',
      count: recipes.length,
      recipes: recipes
    });
    
  } catch (error: any) {
    console.error('Recipes test error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
