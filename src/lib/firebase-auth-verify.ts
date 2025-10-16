import { initializeFirebaseServer } from '@/firebase/server';
import { DecodedIdToken } from 'firebase-admin/auth';

export async function verifyFirebaseToken(authHeader: string | null): Promise<{
  user: DecodedIdToken | null;
  error: string | null;
}> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'No valid authorization header' };
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const { adminAuth } = initializeFirebaseServer();
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { user: decodedToken, error: null };
  } catch (error) {
    console.error('Token verification error:', error);
    return { user: null, error: 'Invalid token' };
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
