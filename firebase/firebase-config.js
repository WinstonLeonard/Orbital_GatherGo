// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBdxI9OgWohbDeCn4e2zBP-1-tdwwbloA",
  authDomain: "fir-auth-c7176.firebaseapp.com",
  projectId: "fir-auth-c7176",
  storageBucket: "fir-auth-c7176.appspot.com",
  messagingSenderId: "382577790366",
  appId: "1:382577790366:web:e638c3092c18713fb61a8f",
  storageBucket: 'fir-auth-c7176.appspot.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const database = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const stor = getStorage(app);

//exports
export const authentication = getAuth(app);
export const db = database;
export const storage = stor;