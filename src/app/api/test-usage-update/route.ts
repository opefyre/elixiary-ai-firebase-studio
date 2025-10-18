import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { APIAuthenticator } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = await initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');
    const email = searchParams.get('email');
    
    if (!apiKey || !email) {
      return NextResponse.json({ error: 'API key and email parameters required' }, { status: 400 });
    }
    
    console.log('=== Testing usage update directly ===');
    console.log('API Key:', apiKey.substring(0, 20) + '...');
    console.log('Email:', email);
    
    // Create APIAuthenticator instance
    const authenticator = new APIAuthenticator();
    
    // Call updateAPIKeyUsage directly using reflection to access private method
    const updateMethod = (authentator as any).updateAPIKeyUsage.bind(authenticator);
    await updateMethod(apiKey, email, adminDb);
    
    // Check the updated document
    const keyDoc = await adminDb.collection('api_keys').doc(apiKey).get();
    const keyData = keyDoc.data();
    
    return NextResponse.json({
      success: true,
      message: 'Usage update test completed',
      apiKey: apiKey.substring(0, 20) + '...',
      updatedUsage: keyData.usage
    });
    
  } catch (error: any) {
    console.error('Test usage update error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
