import { auth, hasFirebaseConfig } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Sign in with email and password
export async function signIn(email: string, password: string) {
  if (!hasFirebaseConfig || !auth) {
    throw new Error('Firebase authentication is not configured');
  }
  
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
  if (!hasFirebaseConfig || !auth) {
    throw new Error('Firebase authentication is not configured');
  }
  
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
  if (!hasFirebaseConfig || !auth) {
    return null;
  }
  return auth.currentUser;
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!hasFirebaseConfig || !auth) {
    // Return a dummy unsubscribe function and immediately call callback with null
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}