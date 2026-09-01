import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";

/** Firestore top-level collection names — kept in one place so a rename never drifts between reads and writes. */
export const COLLECTIONS = {
  users: "users",
  politicians: "politicians",
  politicalPositions: "politicalPositions",
  cases: "cases",
  investigations: "investigations",
  legalEvents: "legalEvents",
  claims: "claims",
  sources: "sources",
  reports: "reports",
  auditLogs: "auditLogs",
  correctionRequests: "correctionRequests",
} as const;

export function withId<T>(snap: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snap.id, ...snap.data() } as T;
}

export async function getDocById<T>(
  collectionName: string,
  id: string,
): Promise<T | null> {
  const snap = await getDoc(doc(getFirebaseDb(), collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function queryCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[],
): Promise<T[]> {
  const q = query(collection(getFirebaseDb(), collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<T>(d));
}

export async function createDoc<T extends Record<string, unknown>>(
  collectionName: string,
  data: T,
): Promise<string> {
  const ref = await addDoc(collection(getFirebaseDb(), collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocById(
  collectionName: string,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export { where, orderBy, fbLimit as limit };
