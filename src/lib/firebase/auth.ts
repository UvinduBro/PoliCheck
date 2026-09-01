import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "./config";
import type { UserProfile } from "@/types";

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

/** Creates the users/{uid} profile doc only if it doesn't already exist, so a repeat sign-in never clobbers a promoted role. */
async function ensureUserProfileDoc(user: User, displayName: string) {
  const ref = doc(getFirebaseDb(), "users", user.uid);
  const existing = await getDoc(ref);
  if (existing.exists()) return;

  const profile: Omit<UserProfile, "createdAt" | "updatedAt"> = {
    uid: user.uid,
    displayName,
    email: user.email ?? "",
    role: "public",
    isActive: true,
  };
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
) {
  const credential = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  await updateProfile(credential.user, { displayName });
  await ensureUserProfileDoc(credential.user, displayName);
  await sendEmailVerification(credential.user);
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  return credential.user;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(getFirebaseAuth(), provider);
  await ensureUserProfileDoc(credential.user, credential.user.displayName ?? "");
  return credential.user;
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function resendEmailVerification() {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("No authenticated user.");
  await sendEmailVerification(user);
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth());
}
