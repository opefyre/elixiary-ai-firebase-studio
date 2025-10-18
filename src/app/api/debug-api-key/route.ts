import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = await initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key parameter required' }, { status: 400 });
    }
    
    const keyDoc = await adminDb.collection('api_keys').doc(apiKey).get();
    
    if (!keyDoc.exists) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }
    
    const keyData = keyDoc.data();
    
    return NextResponse.json({
      apiKey: apiKey.substring(0, 20) + '...',
      exists: keyDoc.exists,
      data: keyData,
      usage: keyData.usage,
      lastUsed: keyData.usage?.lastUsed?.toDate ? keyData.usage.lastUsed.toDate().toISOString() : keyData.usage?.lastUsed
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
