import { initializeFirebaseServer } from '@/firebase/server';
import { DecodedIdToken } from 'firebase-admin/auth';

type VerifyOptions = {
  fallbackToken?: string | null;
};

function extractBearerToken(authHeader: string | null) {
  if (!authHeader) {
    return null;
  }

  const trimmed = authHeader.trim();
  
  if (!trimmed) {
    return null;
  }

  if (trimmed.toLowerCase().startsWith('bearer ')) {
    return trimmed.slice(7).trim();
  }

  // Some proxies or platforms may strip the "Bearer" prefix but keep the raw token.
  return trimmed;
}

export async function verifyFirebaseToken(
  authHeader: string | null,
  options: VerifyOptions = {}
): Promise<{
  user: DecodedIdToken | null;
  error: string | null;
}> {
  console.log('=== Firebase Token Verification ===');
  console.log('Auth header received:', authHeader ? 'present' : 'missing');
  
  const bearerToken = extractBearerToken(authHeader);
  const token = bearerToken || options.fallbackToken || null;
  
  console.log('Token extracted:', token ? 'yes' : 'no');

  if (!token) {
    console.log('No token found - returning error');
    return { user: null, error: 'No valid authorization header' };
  }
  
  try {
    const { adminAuth } = initializeFirebaseServer();
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { user: decodedToken, error: null };
  } catch (error) {
    console.error('Token verification error:', error);
    return { user: null, error: `Invalid token: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export async function getUserByUid(uid: string) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const userDoc = await adminDb.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
