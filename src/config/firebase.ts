import * as Firebase from "firebase/app";
import {
  setPersistence,
  getAuth,
  browserSessionPersistence,
} from "firebase/auth";

export const FirebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export let firebaseApp: Firebase.FirebaseApp = !Firebase.getApps().length
  ? Firebase.initializeApp(FirebaseCredentials)
  : Firebase.getApps()[0];
export const FirebaseAuth = getAuth(firebaseApp);

const configureFirebaseApp = async () => {
  if (!firebaseApp || typeof window === "undefined") return;
  await setPersistence(FirebaseAuth, browserSessionPersistence);
};

configureFirebaseApp();
