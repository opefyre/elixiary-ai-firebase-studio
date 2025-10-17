import { NextRequest, NextResponse } from 'next/server';
import { APIKeyManager } from '@/lib/api-keys';
import { initializeFirebaseServer } from '@/firebase/server';
import { z } from 'zod';

const createKeySchema = z.object({
  name: z.string().min(1).max(50)
});

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Get user data to check if Pro
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    if (userData?.subscriptionTier !== 'pro') {
      return NextResponse.json({ 
        error: `Pro subscription required. Current tier: ${userData?.subscriptionTier || 'none'}` 
      }, { status: 403 });
    }

    const apiKeyManager = new APIKeyManager();
    const keys = await apiKeyManager.getUserAPIKeys(userId);
    
    // Don't return sensitive data
    const response = keys.map(key => ({
      id: key.id,
      name: key.name,
      status: key.status,
      createdAt: key.createdAt,
      expiresAt: key.expiresAt,
      lastUsed: key.usage.lastUsed,
      usage: {
        requestsToday: key.usage.requestsToday,
        requestsThisMonth: key.usage.requestsThisMonth,
        totalRequests: key.usage.totalRequests
      }
    }));
    
    return NextResponse.json({ success: true, data: response });
    
  } catch (error: any) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch API keys: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const body = await request.json();
    const { userId, action, data } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Get user data to check if Pro
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    if (userData?.subscriptionTier !== 'pro') {
      return NextResponse.json({ 
        error: `Pro subscription required. Current tier: ${userData?.subscriptionTier || 'none'}` 
      }, { status: 403 });
    }

    const apiKeyManager = new APIKeyManager();

    if (action === 'create') {
      const { name } = createKeySchema.parse(data);
      const newKey = await apiKeyManager.createAPIKey(userId, userData.email || '', name);
      
      return NextResponse.json({ 
        success: true, 
        data: {
          id: newKey.id,
          name: newKey.name,
          createdAt: newKey.createdAt,
          expiresAt: newKey.expiresAt,
          permissions: newKey.permissions
        }
      });
    }

    if (action === 'delete') {
      const { keyId } = data;
      await apiKeyManager.revokeAPIKey(keyId, userId);
      return NextResponse.json({ success: true, message: 'API key deleted' });
    }

    if (action === 'rotate') {
      const { keyId } = data;
      const newKey = await apiKeyManager.rotateAPIKey(keyId, userId);
      return NextResponse.json({ 
        success: true, 
        data: { newApiKey: newKey }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error: any) {
    console.error('Error with API key operation:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: `Failed to process API key operation: ${error.message}` },
      { status: 500 }
    );
  }
}
