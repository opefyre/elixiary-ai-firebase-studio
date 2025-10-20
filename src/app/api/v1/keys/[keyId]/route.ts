import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';
import { APIKeyManager } from '@/lib/api-keys';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> }
) {
  try {
    const authenticator = new APIAuthenticator();
    const { user } = await authenticator.authenticateRequest(request);
    
    const { keyId } = await params;
    
    const apiKeyManager = new APIKeyManager();
    await apiKeyManager.revokeAPIKey(keyId, user.uid);
    
    return NextResponse.json(authenticator.createSuccessResponse({ 
      message: 'API key revoked successfully' 
    }));
    
  } catch (error: any) {
    console.error('Error revoking API key:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> }
) {
  try {
    const authenticator = new APIAuthenticator();
    const { user } = await authenticator.authenticateRequest(request);
    
    const { keyId } = await params;
    
    const apiKeyManager = new APIKeyManager();
    const newKey = await apiKeyManager.rotateAPIKeyById(keyId, user.uid);
    
    return NextResponse.json(authenticator.createSuccessResponse({
      newApiKey: newKey,
      message: 'API key rotated successfully'
    }));
    
  } catch (error: any) {
    console.error('Error rotating API key:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to rotate API key' },
      { status: 500 }
    );
  }
}
