import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlpPG2xKuJmXF7gJ7ldQVFs2cAl67ozjo",
  authDomain: "budgetbuddy-1c1ea.firebaseapp.com",
  projectId: "budgetbuddy-1c1ea",
  storageBucket: "budgetbuddy-1c1ea.firebasestorage.app",
  messagingSenderId: "770384872338",
  appId: "1:770384872338:web:2a6ff4f193832550a2b74b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);