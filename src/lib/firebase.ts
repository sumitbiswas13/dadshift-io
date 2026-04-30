import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBVbPqrhEgpmhw87qxRcNVHLi4uxNd0XUg",
  authDomain: "dadshift-io.firebaseapp.com",
  projectId: "dadshift-io",
  storageBucket: "dadshift-io.firebasestorage.app",
  messagingSenderId: "85016797054",
  appId: "1:85016797054:web:0f8b40c77c27cd81e79d2f",
  measurementId: "G-1YNFE2JQ3S"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
