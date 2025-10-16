import { NextRequest, NextResponse } from 'next/server';
import { APIKeyManager } from '@/lib/api-keys';
import { verifyFirebaseToken, getUserByUid } from '@/lib/firebase-auth-verify';
import { z } from 'zod';

const createKeySchema = z.object({
  name: z.string().min(1).max(50)
});

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('API route - authHeader:', authHeader ? 'Present' : 'Missing');
    
    const { user, error } = await verifyFirebaseToken(authHeader);
    console.log('API route - verification result:', { user: user ? 'Present' : 'Missing', error });
    
    if (!user || error) {
      return NextResponse.json(
        { success: false, error: `Authentication required: ${error || 'No user'}` },
        { status: 401 }
      );
    }

    const userData = await getUserByUid(user.uid);
    console.log('User data retrieved:', { 
      uid: userData?.id, 
      email: userData?.email,
      subscription: userData?.subscription 
    });
    
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is Pro
    console.log('Checking subscription tier:', userData.subscriptionTier);
    if (userData.subscriptionTier !== 'pro') {
      return NextResponse.json(
        { success: false, error: `Pro subscription required. Current tier: ${userData.subscriptionTier || 'none'}` },
        { status: 403 }
      );
    }

    const apiKeyManager = new APIKeyManager();
    const keys = await apiKeyManager.getUserAPIKeys(user.uid);
    
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
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { user, error } = await verifyFirebaseToken(authHeader);
    
    if (!user || error) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = createKeySchema.parse(body);
    
    const userData = await getUserByUid(user.uid);
    console.log('POST - User data retrieved:', { 
      uid: userData?.id, 
      email: userData?.email,
      subscription: userData?.subscription 
    });
    
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is Pro
    console.log('POST - Checking subscription tier:', userData.subscriptionTier);
    if (userData.subscriptionTier !== 'pro') {
      return NextResponse.json(
        { success: false, error: `Pro subscription required. Current tier: ${userData.subscriptionTier || 'none'}` },
        { status: 403 }
      );
    }

    const apiKeyManager = new APIKeyManager();
    const newKey = await apiKeyManager.createAPIKey(user.uid, user.email || '', name);
    
    // Don't return the full key data for security
    const response = {
      id: newKey.id,
      name: newKey.name,
      createdAt: newKey.createdAt,
      expiresAt: newKey.expiresAt,
      permissions: newKey.permissions
    };
    
    return NextResponse.json({ success: true, data: response });
    
  } catch (error: any) {
    console.error('Error creating API key:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}
