// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9nauB7Tj71RDjl5nNY6YwdHbh-jrSFtk",
  authDomain: "yayasanpermataarridha-3b036.firebaseapp.com",
  projectId: "yayasanpermataarridha-3b036",
  storageBucket: "yayasanpermataarridha-3b036.firebasestorage.app",
  messagingSenderId: "1087047736289",
  appId: "1:1087047736289:web:598daad1866c37c63a10a0",
  measurementId: "G-KFSHTDXGPS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);