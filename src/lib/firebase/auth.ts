import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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

export async function updateDisplayName(user: User, displayName: string) {
  await updateProfile(user, { displayName });
  await updateDoc(doc(getFirebaseDb(), "users", user.uid), {
    displayName,
    updatedAt: serverTimestamp(),
  });
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth());
}

/**
 * Deletes the caller's own account: the Firestore profile doc first (while still
 * authenticated as its owner), then the Firebase Auth account itself. Auth's deleteUser
 * requires a recent sign-in — if the session is stale, it throws auth/requires-recent-login.
 * We handle that by signing the user out anyway (their profile doc is already gone, so a
 * fresh sign-in recreates a blank "public" profile via ensureUserProfileDoc) and surfacing a
 * message asking them to sign back in and retry, which will then succeed immediately since
 * the sign-in is recent.
 */
export async function deleteAccount(user: User) {
  await deleteDoc(doc(getFirebaseDb(), "users", user.uid));
  try {
    await deleteUser(user);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "auth/requires-recent-login") {
      await firebaseSignOut(getFirebaseAuth());
      throw new Error(
        "Your data was deleted. For security, please sign in again and retry Delete account to finish closing your login.",
      );
    }
    throw error;
  }
}
