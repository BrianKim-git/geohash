import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { VITE_FIREBASE_API_KEY, VITE_FIREBASE_APP_ID, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_MEASUREMENT_ID, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_PROJECT_ID } from '$env/static/private';

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
  measurementID: VITE_FIREBASE_MEASUREMENT_ID
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBH8HJfW_7OhYz426jENbHRD2SYeCM20c4",
//   authDomain: "geohash-38aa6.firebaseapp.com",
//   projectId: "geohash-38aa6",
//   storageBucket: "geohash-38aa6.appspot.com",
//   messagingSenderId: "909495647690",
//   appId: "1:909495647690:web:d6258b6ea784458bfea333",
//   measurementId: "G-BM2TS6TVWF"
// };

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
}

export const db = getFirestore(app);
export const auth = getAuth(app);