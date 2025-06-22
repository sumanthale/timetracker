import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4VkSNy9EjSboqk2l4TWxtihCz6w7c0pk",
  authDomain: "croud-funding.firebaseapp.com",
  projectId: "croud-funding",
  storageBucket: "croud-funding.firebasestorage.app",
  messagingSenderId: "227266900318",
  appId: "1:227266900318:web:8f5f39c842c2c5ec855fcf",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;