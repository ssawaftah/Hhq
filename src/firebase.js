import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDsN-OmtB-XFKGsYmX6zh_VvInCyE-rKtk',
  authDomain: 'al3arbicv.firebaseapp.com',
  databaseURL: 'https://al3arbicv-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'al3arbicv',
  storageBucket: 'al3arbicv.firebasestorage.app',
  messagingSenderId: '901851337200',
  appId: '1:901851337200:web:76889949bf96c96b1c8d35'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
