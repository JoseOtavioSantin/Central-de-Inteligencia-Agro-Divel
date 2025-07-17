// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsGoYTdNTowbnvlnsD-K5ZVN5iHU2vXuA",
  authDomain: "agro-divel-central.firebaseapp.com",
  projectId: "agro-divel-central",
  storageBucket: "agro-divel-central.firebasestorage.app",
  messagingSenderId: "159916837344",
  appId: "1:159916837344:web:574a34c7aeddf8940f4385"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
