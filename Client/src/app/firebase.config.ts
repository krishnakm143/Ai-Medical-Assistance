// firebase-config.ts

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkHpW4WdgcEXGbZAWcrIxx2Sy442oFzcE",
  authDomain: "ai-medical-assistance.firebaseapp.com",
  projectId: "ai-medical-assistance",
  storageBucket: "ai-medical-assistance.appspot.com",
  messagingSenderId: "957908000662",
  appId: "1:957908000662:web:476eadfee62f4a225587b7",
  measurementId: "G-M6WZ4HHGXX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Analytics only if supported
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized:", analytics);
  } else {
    console.log("Firebase Analytics is not supported in this environment.");
  }
});

export default app;
