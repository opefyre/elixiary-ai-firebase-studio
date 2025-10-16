import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { APIKeyManager } from '@/lib/api-keys';
import { z } from 'zod';

const createKeySchema = z.object({
  name: z.string().min(1).max(50)
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { adminDb } = initializeFirebaseServer();
    
    // Get user by email
    const usersSnapshot = await adminDb
      .collection('users')
      .where('email', '==', session.user.email)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    
    // Check if user is Pro
    if (userData.subscription?.tier !== 'pro') {
      return NextResponse.json(
        { success: false, error: 'Pro subscription required' },
        { status: 403 }
      );
    }

    const apiKeyManager = new APIKeyManager();
    const keys = await apiKeyManager.getUserAPIKeys(userDoc.id);
    
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = createKeySchema.parse(body);
    
    const { adminDb } = initializeFirebaseServer();
    
    // Get user by email
    const usersSnapshot = await adminDb
      .collection('users')
      .where('email', '==', session.user.email)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    
    // Check if user is Pro
    if (userData.subscription?.tier !== 'pro') {
      return NextResponse.json(
        { success: false, error: 'Pro subscription required' },
        { status: 403 }
      );
    }

    const apiKeyManager = new APIKeyManager();
    const newKey = await apiKeyManager.createAPIKey(userDoc.id, session.user.email, name);
    
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
