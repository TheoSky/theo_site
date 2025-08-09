import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Sign out
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}