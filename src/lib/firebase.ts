// Configuración de Firebase para tu proyecto
// 1. Ve a https://console.firebase.google.com/ y crea un proyecto nuevo
// 2. Haz clic en "Agregar aplicación web" y copia la configuración que te da Firebase
// 3. Pega los valores en el objeto firebaseConfig de abajo

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVu0_RQb8XKStb6DOqdW_QwYTyz6tbLB0",
  authDomain: "alumnos-66525.firebaseapp.com",
  projectId: "alumnos-66525",
storageBucket: "alumnos-66525.appspot.com",
  messagingSenderId: "5704294745",
  appId: "1:5704294745:web:bde7b521e8673721f16c48"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
