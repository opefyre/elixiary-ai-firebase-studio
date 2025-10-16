import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { APIKeyManager } from '@/lib/api-keys';
import { z } from 'zod';

const createKeySchema = z.object({
  name: z.string().min(1).max(50)
});

export async function POST(request: NextRequest) {
  try {
    console.log('Creating API key...');
    const authenticator = new APIAuthenticator();
    const { user, apiKey } = await authenticator.authenticateRequest(request);
    console.log('User:', user);
    console.log('API Key:', apiKey);
    
    const body = await request.json();
    const { name } = createKeySchema.parse(body);
    console.log('Creating key with name:', name);
    
    const apiKeyManager = new APIKeyManager();
    const userId = user.uid || user.id;
    const userEmail = user.email || apiKey.email; // Use email from API key if not in user object
    console.log('Using userId:', userId, 'email:', userEmail);
    const newKey = await apiKeyManager.createAPIKey(userId, userEmail, name);
    
    // Don't return the full key data for security
    const response = {
      id: newKey.id,
      name: newKey.name,
      createdAt: newKey.createdAt,
      expiresAt: newKey.expiresAt,
      permissions: newKey.permissions
    };
    
    return NextResponse.json(authenticator.createSuccessResponse(response));
    
  } catch (error: any) {
    console.error('Error creating API key:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authenticator = new APIAuthenticator();
    const { user } = await authenticator.authenticateRequest(request);
    
    const apiKeyManager = new APIKeyManager();
    const userId = user.uid || user.id;
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
    
    return NextResponse.json(authenticator.createSuccessResponse(response));
    
  } catch (error: any) {
    console.error('Error fetching API keys:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}
