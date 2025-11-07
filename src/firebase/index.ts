'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';

type FirebaseSdks = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let cachedSdks: FirebaseSdks | null = null;

export function initializeFirebase() {
  if (cachedSdks) {
    return cachedSdks;
  }

  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);
    try {
      initializeFirestore(firebaseApp, {
        experimentalAutoDetectLongPolling: true,
        useFetchStreams: false
      });
    } catch (error) {
      // Firestore may already be initialized; ignore re-initialization errors.
    }
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  if (cachedSdks && cachedSdks.firebaseApp === firebaseApp) {
    return cachedSdks;
  }

  cachedSdks = {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };

  return cachedSdks;
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-recipe-actions';
export * from './firestore/use-recipes';
export * from './firestore/use-subscription';
