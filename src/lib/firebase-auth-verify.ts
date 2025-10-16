import { initializeFirebaseServer } from '@/firebase/server';
import { DecodedIdToken } from 'firebase-admin/auth';

export async function verifyFirebaseToken(authHeader: string | null): Promise<{
  user: DecodedIdToken | null;
  error: string | null;
}> {
  console.log('Verifying token, authHeader:', authHeader ? 'Present' : 'Missing');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Invalid auth header format');
    return { user: null, error: 'No valid authorization header' };
  }

  const token = authHeader.split('Bearer ')[1];
  console.log('Token extracted, length:', token.length);
  
  try {
    const { adminAuth } = initializeFirebaseServer();
    console.log('Admin auth initialized');
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('Token verified successfully for user:', decodedToken.uid);
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
