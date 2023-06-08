import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcJBg1e1GG9x1LSCgICXylX_wXiNcS6oI",
  authDomain: "zamisport-f6755.firebaseapp.com",
  projectId: "zamisport-f6755",
  storageBucket: "zamisport-f6755.appspot.com",
  messagingSenderId: "398041518917",
  appId: "1:398041518917:web:ed83b80a833767abd5e42c",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
