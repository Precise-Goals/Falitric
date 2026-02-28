// firebase.js — Faltric shared Firebase client
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  push,
  onValue,
  remove,
} from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);

// ── Re-export helpers so all components import from one place ──
export { ref, get, set, update, push, onValue, remove };
