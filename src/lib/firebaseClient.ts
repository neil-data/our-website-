import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function getFirebaseAuth() {
  if (authInstance) return authInstance;

  const config = getFirebaseConfig();
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    // If we're on the server during build, don't crash, just return null.
    // The library functions using this should handle the null/catch error.
    if (typeof window === 'undefined') {
      console.warn(`Firebase Auth missing keys: ${missing.join(', ')}`);
      return null as any;
    }
    throw new Error(`Firebase is not configured. Missing: ${missing.join(', ')}`);
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  authInstance = getAuth(app);

  return authInstance;
}

export function getFirebaseDb() {
  if (dbInstance) return dbInstance;

  const config = getFirebaseConfig();
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    if (typeof window === 'undefined') {
      console.warn(`Firebase Firestore missing keys: ${missing.join(', ')}`);
      return null as any;
    }
    throw new Error(`Firebase is not configured. Missing: ${missing.join(', ')}`);
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  dbInstance = getFirestore(app);

  return dbInstance;
}
