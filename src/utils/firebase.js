import { initializeApp } from 'firebase/app';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// import firebase from 'firebase/compat/app'

const firebaseConfig = {
  apiKey: "AIzaSyDE4Ow2c41a4NTgjBJTj06UQIKG4QrsJK4",
  authDomain: "social-cool-b8cbe.firebaseapp.com",
  projectId: "social-cool-b8cbe",
  storageBucket: "social-cool-b8cbe.appspot.com",
  messagingSenderId: "493828729126",
  appId: "1:493828729126:web:6bbc47f81efd3d8d0239e7"
};

// const firebaseApp=initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;

