import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAcW8W0l0ymXWInaF70xXFo7RhyZpM0nDA",
  authDomain: "eco-app-cb48b.firebaseapp.com",
  projectId: "eco-app-cb48b",
  storageBucket: "eco-app-cb48b.firebasestorage.app",
  messagingSenderId: "140699394049",
  appId: "1:140699394049:web:0d59af21f16e23b8bc2000",
  measurementId: "G-Y42N6XBS1S"
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar la autenticación
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializar Firestore (base de datos)
const db = getFirestore(app);

export { app, auth, db };
