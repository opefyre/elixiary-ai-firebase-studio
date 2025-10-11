'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  try {
    if (!getApps().length) {
      // Use the explicit config object to avoid App Hosting interference
      console.log('Initializing Firebase app with config:', firebaseConfig);
      const firebaseApp = initializeApp(firebaseConfig);
      const sdks = getSdks(firebaseApp);
      console.log('Firebase app initialized successfully');
      return sdks;
    }

    // If already initialized, return the SDKs with the already initialized App
    console.log('Using existing Firebase app');
    return getSdks(getApp());
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-recipes';
export * from './firestore/use-subscription';
