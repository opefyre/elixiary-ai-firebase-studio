type RequiredFirebaseEnv =
  | 'NEXT_PUBLIC_FIREBASE_API_KEY'
  | 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
  | 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  | 'NEXT_PUBLIC_FIREBASE_APP_ID'
  | 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID';

type OptionalFirebaseEnv =
  | 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
  | 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET';

function getRequiredEnv(name: RequiredFirebaseEnv) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Firebase configuration error: Missing environment variable "${name}". ` +
        'Ensure all NEXT_PUBLIC_FIREBASE_* variables are defined in your environment.'
    );
  }

  return value;
}

function getOptionalEnv(name: OptionalFirebaseEnv) {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export const firebaseConfig = {
  apiKey: getRequiredEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getRequiredEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getRequiredEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  appId: getRequiredEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
  messagingSenderId: getRequiredEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  measurementId: getOptionalEnv('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
  storageBucket: getOptionalEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
};
