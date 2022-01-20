// https://firebase.google.com/docs/web/modular-upgrade
// firebase version 9 Firebase, make sure to change your path to:
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyD1MKQfSnl7L4Kv_1sLtjiXNqimbf47lbA",
  authDomain: "shopping-cart-4a357.firebaseapp.com",
  projectId: "shopping-cart-4a357",
  storageBucket: "shopping-cart-4a357.appspot.com",
  messagingSenderId: "515757331893",
  appId: "1:515757331893:web:4febe556a34bed487975fc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.firestore();
export const firebaseAuth = firebase.auth();