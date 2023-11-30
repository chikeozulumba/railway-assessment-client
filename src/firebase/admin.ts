import { FirebaseCredentials } from "@/config";
import * as firebaseAdmin from "firebase-admin";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp(FirebaseCredentials);
}

export { firebaseAdmin };
