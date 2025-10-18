import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

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
    
    // Test direct Firestore update
    const now = new Date();
    console.log('Updating Firestore document...');
    
    await adminDb.collection('api_keys').doc(apiKey).update({
      'usage.totalRequests': adminDb.FieldValue.increment(1),
      'usage.lastUsed': now,
      'usage.requestsToday': adminDb.FieldValue.increment(1),
      'usage.requestsThisMonth': adminDb.FieldValue.increment(1),
      'updatedAt': now
    });
    
    console.log('Firestore update completed');
    
    // Check the updated document
    const keyDoc = await adminDb.collection('api_keys').doc(apiKey).get();
    const keyData = keyDoc.data();
    
    return NextResponse.json({
      success: true,
      message: 'Usage update test completed',
      apiKey: apiKey.substring(0, 20) + '...',
      updatedUsage: keyData.usage,
      lastUsed: keyData.usage?.lastUsed?.toDate ? keyData.usage.lastUsed.toDate().toISOString() : keyData.usage?.lastUsed
    });
    
  } catch (error: any) {
    console.error('Test usage update error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}