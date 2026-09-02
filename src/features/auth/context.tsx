import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
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

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribeAuth = subscribeToAuthState((nextUser) => {
      setUser(nextUser);
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
        setUserProfile(snap.exists() ? (snap.data() as UserProfile) : null);
        setLoading(false);
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
