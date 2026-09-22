//inicializa conexão com o firebase
import { initializeApp } from 'firebase/app';
//incializa conexão com o banco de dados
import { getDatabase } from 'firebase/database';
//iniciliaza com a autenticação do firebase
import { initializeAuth } from 'firebase/auth';
 

const firebaseConfig = {
  apiKey: "AIzaSyBtj5SOy6BByg2BCoAKhuPY3irPIYHCZVQ",
  authDomain: "appresolve-19a63.firebaseapp.com",
  databaseURL: "https://appresolve-19a63-default-rtdb.firebaseio.com",
  projectId: "appresolve-19a63",
  storageBucket: "appresolve-19a63.firebasestorage.app",
  messagingSenderId: "630160820147",
  appId: "1:630160820147:web:9d05fa63bb638b024eedc6",
  measurementId: "G-JLLTDP1KQ0"

};

 

const app = initializeApp(firebaseConfig);

 

// Firebase Authentication

export const auth = initializeAuth(app, {

 
});

 

// Realtime Database

export const database = getDatabase(app);

 

export default app;


