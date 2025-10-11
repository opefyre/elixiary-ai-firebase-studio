import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Server-side Firebase initialization for webhooks and API routes
export function initializeFirebaseServer() {
  // Check if already initialized
  if (getApps().length > 0) {
    return {
      firestore: getFirestore(),
    };
  }

  // Initialize Firebase Admin SDK
  const app = initializeApp({
    credential: cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!)),
    projectId: 'studio-1063505923-cbb37',
  });

  return {
    firestore: getFirestore(app),
  };
}
