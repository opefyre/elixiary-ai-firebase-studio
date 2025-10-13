import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Server-side Firebase initialization for webhooks and API routes
export function initializeFirebaseServer() {
  // Check if already initialized
  if (getApps().length > 0) {
    return {
      adminDb: getFirestore(),
    };
  }

  // Try to get service account from environment variable first
  let serviceAccount;
  
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      console.log('Service account parsed from environment variable, project_id:', serviceAccount.project_id);
    } catch (error) {
      console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', error);
      throw new Error('Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON format');
    }
  } else {
    // Fallback: try to use individual environment variables
    serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID || "studio-1063505923-cbb37",
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    
    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error('Firebase service account credentials not found. Please set GOOGLE_APPLICATION_CREDENTIALS_JSON or FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables.');
    }
    
    console.log('Using individual environment variables for Firebase Admin SDK');
  }

  // Use the project_id from the service account
  const projectId = serviceAccount.project_id;
  if (!projectId) {
    throw new Error('No project_id found in service account');
  }

  console.log('Initializing Firebase Admin SDK with project:', projectId);

  // Initialize Firebase Admin SDK
  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: projectId,
  });

  return {
    adminDb: getFirestore(app),
  };
}
