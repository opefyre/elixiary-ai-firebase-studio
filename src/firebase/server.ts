import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Server-side Firebase initialization for webhooks and API routes
export function initializeFirebaseServer() {
  // Check if already initialized
  if (getApps().length > 0) {
    return {
      adminDb: getFirestore(),
      adminAuth: getAuth(),
    };
  }

  // Try to get service account from environment variable first
  let serviceAccount;
  
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    } catch (error) {
      throw new Error('Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON format');
    }
  } else {
    // Fallback: try to use individual environment variables
    serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    
    if (!serviceAccount.client_email || !serviceAccount.private_key || !serviceAccount.project_id) {
      throw new Error('Firebase service account credentials not found. Please set GOOGLE_APPLICATION_CREDENTIALS_JSON or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables.');
    }
  }

  // Use the project_id from the service account
  const projectId = serviceAccount.project_id;
  if (!projectId) {
    throw new Error('No project_id found in service account');
  }

  // Initialize Firebase Admin SDK
  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: projectId,
  });

  const adminDb = getFirestore(app);
  const adminAuth = getAuth(app);
  
  return {
    adminDb,
    adminAuth,
  };
}
