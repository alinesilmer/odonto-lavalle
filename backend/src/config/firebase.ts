import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { env } from "./env.js";

export const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    }),
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
  });

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = env.FIREBASE_STORAGE_BUCKET ? getStorage(app) : null;

db.settings({ ignoreUndefinedProperties: true });

/** Every collection this project owns. Keep in sync with scripts/cleanup-firestore.ts. */
export const collections = {
  patients: "patients",
  appointments: "appointments",
  historyRecords: "historyRecords",
  patientFiles: "patientFiles",
  treatments: "treatments",
  stock: "stock",
  reminders: "reminders",
  contactRequests: "contactRequests",
  newsletter: "newsletter",
  publicMessages: "publicMessages",
  supportTickets: "supportTickets",
  /** Website content edited from the dashboard. */
  faqs: "faqs",
  services: "services",
  insurances: "insurances",
  settings: "settings",
} as const;
