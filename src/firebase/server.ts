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

  // Validate environment variables
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    console.log('Service account parsed successfully, project_id:', serviceAccount.project_id);
  } catch (error) {
    console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', error);
    throw new Error('Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON format');
  }

  // Use the project_id from the service account JSON
  const projectId = serviceAccount.project_id;
  if (!projectId) {
    throw new Error('No project_id found in service account JSON');
  }

  console.log('Initializing Firebase Admin SDK with project:', projectId);

  // Initialize Firebase Admin SDK
  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: projectId,
  });

  return {
    firestore: getFirestore(app),
  };
}
