import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB0GfiZsPDcGKWaAwrJDE35N_pOJ4WHZSg",
  authDomain: "gen-lang-client-0580561052.firebaseapp.com",
  projectId: "gen-lang-client-0580561052",
  storageBucket: "gen-lang-client-0580561052.firebasestorage.app",
  messagingSenderId: "144735664346",
  appId: "1:144735664346:web:90a74a4ec6d7c1d199cde3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific databaseId from the config
export const db = getFirestore(app, "ai-studio-a8f9bf48-de67-4eec-b109-cdd542392951");

// Initialize Auth
export const auth = getAuth(app);
