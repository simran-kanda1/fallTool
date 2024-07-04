// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFXm0HJiTmzAbzxxz2-nVJvSiJMLUZ2ZM",
  authDomain: "falls-tool.firebaseapp.com",
  projectId: "falls-tool",
  storageBucket: "falls-tool.appspot.com",
  messagingSenderId: "349960015978",
  appId: "1:349960015978:web:6a6d1da4f2b6700ffc3a13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db};