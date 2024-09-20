import { VITE_CLIENT_EMAIL, VITE_PRIVATE_KEY, VITE_PROJECT_ID } from '$env/static/private';
import admin, { type ServiceAccount } from 'firebase-admin';

const serviceAccount = {
    projectId: VITE_PROJECT_ID,
    clientEmail: VITE_CLIENT_EMAIL,
    privateKey: VITE_PRIVATE_KEY
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export const db = admin.firestore();