import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3tfOM7cn6JrxNBFPRTdGTprIT74NQN2k",
  authDomain: "adverts-95edd.firebaseapp.com",
  projectId: "adverts-95edd",
  storageBucket: "adverts-95edd.appspot.com",
  messagingSenderId: "798968833357",
  appId: "1:798968833357:web:4ecdfef53f399081bcc304",
  measurementId: "G-HKB0QYZRPD"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

