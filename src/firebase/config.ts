const getEnv = (key: string, options?: { optional?: boolean; fallback?: string }) => {
  const value = process.env[key] ?? options?.fallback;

  if (!value && !options?.optional) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const firebaseConfig = {
  projectId: getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  appId: getEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  apiKey: getEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  measurementId: getEnv("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", { optional: true, fallback: "" }),
  messagingSenderId: getEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
};
