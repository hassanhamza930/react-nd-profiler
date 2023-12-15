import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-uaMtPcD91tltXyB7_4GHji-nUF5ULYE",
  authDomain: "nd-profiler.firebaseapp.com",
  projectId: "nd-profiler",
  storageBucket: "nd-profiler.appspot.com",
  messagingSenderId: "532932622536",
  appId: "1:532932622536:web:54aef54d72692411508dfd",
  measurementId: "G-WVK1C7FYP2",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

