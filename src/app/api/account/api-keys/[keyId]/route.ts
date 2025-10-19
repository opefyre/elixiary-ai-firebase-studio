import { NextRequest, NextResponse } from 'next/server';
import { APIKeyManager } from '@/lib/api-keys';
import { verifyFirebaseToken, getUserByUid } from '@/lib/firebase-auth-verify';

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
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

    const { keyId } = params;
    
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
        { success: false, error: 'Pro subscription required' },
        { status: 403 }
      );
    }

    const apiKeyManager = new APIKeyManager();
    await apiKeyManager.revokeAPIKey(keyId, user.uid);
    
    return NextResponse.json({ 
      success: true, 
      data: { message: 'API key revoked successfully' }
    });
    
  } catch (error: any) {
    console.error('Error revoking API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
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

    const { keyId } = params;
    
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
        { success: false, error: 'Pro subscription required' },
        { status: 403 }
      );
    }

    const apiKeyManager = new APIKeyManager();
    const newKey = await apiKeyManager.rotateAPIKey(keyId, user.uid);
    
    return NextResponse.json({
      success: true,
      data: {
        newApiKey: newKey,
        message: 'API key rotated successfully'
      }
    });
    
  } catch (error: any) {
    console.error('Error rotating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to rotate API key' },
      { status: 500 }
    );
  }
}
