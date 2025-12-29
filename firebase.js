import admin from "firebase-admin";
import path from "path";

const serviceAccount = path.resolve("./biblio_credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export {db};
