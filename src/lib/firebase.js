import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapplication-6d42c.firebaseapp.com",
  projectId: "chatapplication-6d42c",
  storageBucket: "chatapplication-6d42c.appspot.com",
  messagingSenderId: "398812450125",
  appId: "1:398812450125:web:bbccd5b3bb0526cafefb04"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()