import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhKzDHg5o2_891FTSbGwr2RsCwM-cehGM",
  authDomain: "familyconnect-a56a0.firebaseapp.com",
  projectId: "familyconnect-a56a0",
  storageBucket: "familyconnect-a56a0.appspot.com",
  messagingSenderId: "352525739703",
  appId: "1:352525739703:web:50f3611584192ea68a0f32",
  measurementId: "G-6Q1VR8KNBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
