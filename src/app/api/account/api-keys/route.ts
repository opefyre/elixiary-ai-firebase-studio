import { NextRequest, NextResponse } from 'next/server';
import { APIKeyManager } from '@/lib/api-keys';
import { verifyFirebaseToken, getUserByUid } from '@/lib/firebase-auth-verify';
import { z } from 'zod';

const createKeySchema = z.object({
  name: z.string().min(1).max(50)
});

function resolveAuthContext(request: NextRequest) {
  const authHeader =
    request.headers.get('authorization') ||
    request.headers.get('Authorization');
  const fallbackToken =
    request.headers.get('x-firebase-id-token') ||
    request.headers.get('X-Firebase-Id-Token') ||
    request.cookies.get('__session')?.value ||
    null;

  return { authHeader, fallbackToken };
}

export async function GET(request: NextRequest) {
  try {
    const { authHeader, fallbackToken } = resolveAuthContext(request);

    const { user, error } = await verifyFirebaseToken(authHeader, {
      fallbackToken,
    });
    
    if (!user || error) {
      return NextResponse.json(
        { success: false, error: `Authentication required: ${error || 'No user'}` },
        { status: 401 }
      );
    }

    const userData = await getUserByUid(user.uid);
    
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is Pro
    if (userData.subscriptionTier !== 'pro') {
      return NextResponse.json(
        { success: false, error: `Pro subscription required. Current tier: ${userData.subscriptionTier || 'none'}` },
        { status: 403 }
      );
    }

    const apiKeyManager = new APIKeyManager();
    const keys = await apiKeyManager.getUserAPIKeys(user.uid);
    
    // Don't return sensitive data and ensure proper date formatting
    const response = keys.map(key => ({
      id: key.id,
      name: key.name,
      status: key.status,
      createdAt: key.createdAt instanceof Date ? key.createdAt.toISOString() : new Date(key.createdAt).toISOString(),
      expiresAt: key.expiresAt instanceof Date ? key.expiresAt.toISOString() : new Date(key.expiresAt).toISOString(),
      lastUsed: key.usage.lastUsed ? (key.usage.lastUsed instanceof Date ? key.usage.lastUsed.toISOString() : new Date(key.usage.lastUsed).toISOString()) : null,
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
    const { authHeader, fallbackToken } = resolveAuthContext(request);
    const { user, error } = await verifyFirebaseToken(authHeader, {
      fallbackToken,
    });
    
    if (!user || error) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = createKeySchema.parse(body);
    
    const userData = await getUserByUid(user.uid);
    
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is Pro
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
      { success: false, error: `Failed to create API key: ${error.message}` },
      { status: 500 }
    );
  }
}
