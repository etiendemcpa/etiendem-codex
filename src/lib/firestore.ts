import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let app: App | undefined;

function initializeFirebaseApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (serviceAccountJson) {
    return initializeApp({
      credential: cert(JSON.parse(serviceAccountJson)),
    });
  }

  if (projectId) {
    return initializeApp({
      projectId,
    });
  }

  return initializeApp();
}

export function getFirestoreDb(): Firestore {
  if (!app) {
    app = initializeFirebaseApp();
  }

  return getFirestore(app);
}
