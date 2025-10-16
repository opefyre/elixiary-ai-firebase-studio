import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { APIKeyManager } from '@/lib/api-keys';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { keyId } = params;
    
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
    await apiKeyManager.revokeAPIKey(keyId, userDoc.id);
    
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { keyId } = params;
    
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
    const newKey = await apiKeyManager.rotateAPIKey(keyId, userDoc.id);
    
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
