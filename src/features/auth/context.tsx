import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { firebaseConfigured } from "@/lib/firebase/config";
import { subscribeToAuthState } from "@/lib/firebase/auth";
import { getFirebaseDb } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/firestore";
import type { UserProfile } from "@/types";

export interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  firebaseReady: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  userProfile: null,
  loading: true,
  firebaseReady: firebaseConfigured,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const previousRoleRef = useRef<string | null>(null);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribeAuth = subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      previousRoleRef.current = null;
      if (!nextUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!firebaseConfigured || !user) return;
    const unsubscribeProfile = onSnapshot(
      doc(getFirebaseDb(), COLLECTIONS.users, user.uid),
      (snap) => {
        const profile = snap.exists() ? (snap.data() as UserProfile) : null;
        setUserProfile(profile);
        setLoading(false);

        // Firestore's write rules authorize off the ID token's "role" custom claim, which a
        // Cloud Function sets asynchronously whenever this doc's role field changes. The
        // client's cached token doesn't pick that up on its own — without this, a role
        // promotion is reflected in the UI immediately (this listener is live) but every
        // write still fails as "Missing or insufficient permissions" until the next sign-in
        // or the token's ~1hr natural refresh. Skip the very first snapshot (sign-in already
        // gets a fresh token) and only force a refresh when the role actually changes.
        if (profile && profile.role !== previousRoleRef.current) {
          if (previousRoleRef.current !== null) {
            user.getIdToken(true).catch(() => {});
          }
          previousRoleRef.current = profile.role;
        }
      },
      () => setLoading(false),
    );
    return () => unsubscribeProfile();
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, userProfile, loading, firebaseReady: firebaseConfigured }),
    [user, userProfile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
