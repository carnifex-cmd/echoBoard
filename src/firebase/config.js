// Firebase configuration
// To set up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing project
// 3. Enable Authentication (Google provider)
// 4. Create Firestore database
// 5. Enable Firebase Storage
// 6. Get your config from Project Settings > General > Your apps
// 7. Replace the config below with your actual Firebase config

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAS0ne9L84B6maNTLTwYnWw-plwq55mdS0",
  authDomain: "echoboard-fe125.firebaseapp.com",
  projectId: "echoboard-fe125",
  storageBucket: "echoboard-fe125.firebasestorage.app",
  messagingSenderId: "469052930823",
  appId: "1:469052930823:web:51da5dda66830aba75a3a2",
  measurementId: "G-09KCYYGY6Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 