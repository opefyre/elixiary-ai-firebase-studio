import { initializeFirebaseServer } from '@/firebase/server';
import { DecodedIdToken } from 'firebase-admin/auth';

type VerifyOptions = {
  fallbackToken?: string | null;
};

function extractBearerToken(authHeader: string | null) {
  console.log('extractBearerToken input:', authHeader);
  
  if (!authHeader) {
    console.log('No auth header provided');
    return null;
  }

  const trimmed = authHeader.trim();
  console.log('Trimmed header:', trimmed);
  
  if (!trimmed) {
    console.log('Header is empty after trimming');
    return null;
  }

  if (trimmed.toLowerCase().startsWith('bearer ')) {
    const token = trimmed.slice(7).trim();
    console.log('Extracted Bearer token:', token.substring(0, 20) + '...');
    return token;
  }

  // Some proxies or platforms may strip the "Bearer" prefix but keep the raw token.
  console.log('No Bearer prefix found, returning trimmed header as token');
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
  console.log('Auth header received:', authHeader);
  
  const bearerToken = extractBearerToken(authHeader);
  const token = bearerToken || options.fallbackToken || null;
  
  console.log('Extracted bearer token:', bearerToken ? bearerToken.substring(0, 20) + '...' : 'null');
  console.log('Final token:', token ? token.substring(0, 20) + '...' : 'null');

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
