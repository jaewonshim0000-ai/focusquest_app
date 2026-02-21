// ──────────────────────────────────────────────────
// Authentication Service
// ──────────────────────────────────────────────────

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from './firebase';
import type { User, UserRole } from '@models/index';

/**
 * Register a new parent account.
 */
export async function registerParent(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user: User = {
    uid: credential.user.uid,
    email,
    displayName,
    role: 'parent',
    childUids: [],
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', user.uid), {
    ...user,
    createdAt: serverTimestamp(),
  });

  return user;
}

/**
 * Register a child account linked to a parent.
 */
export async function registerChild(
  parentUid: string,
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user: User = {
    uid: credential.user.uid,
    email,
    displayName,
    role: 'student',
    parentUid,
    createdAt: new Date().toISOString(),
  };

  // Create child user document
  await setDoc(doc(db, 'users', user.uid), {
    ...user,
    createdAt: serverTimestamp(),
  });

  // Link child to parent
  await updateDoc(doc(db, 'users', parentUid), {
    childUids: arrayUnion(user.uid),
  });

  return user;
}

/**
 * Sign in an existing user.
 */
export async function signIn(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', credential.user.uid));

  if (!userDoc.exists()) {
    throw new Error('User profile not found');
  }

  return userDoc.data() as User;
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

/**
 * Get the current user's profile.
 */
export async function getCurrentUserProfile(): Promise<User | null> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  if (!userDoc.exists()) return null;

  return userDoc.data() as User;
}

/**
 * Subscribe to auth state changes.
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}
