import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Firebase connection...');
    const { adminDb } = initializeFirebaseServer();
    console.log('Firebase initialized, testing collection access...');
    
    // Test basic Firestore access
    const testDoc = await adminDb.collection('test').doc('test').get();
    console.log('Test document access successful');
    
    // Test curated-recipes collection
    const recipesSnapshot = await adminDb.collection('curated-recipes').limit(1).get();
    console.log('Curated recipes access successful, count:', recipesSnapshot.size);
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      recipesCount: recipesSnapshot.size
    });
    
  } catch (error: any) {
    console.error('Firebase test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
