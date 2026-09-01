import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./config";
import { COLLECTIONS } from "./firestore";

export interface AuditLogEntry {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

/** Every create/update/publish/delete flow should call this — audit logs are append-only (see firestore.rules). */
export async function writeAuditLog(entry: AuditLogEntry): Promise<void> {
  await addDoc(collection(getFirebaseDb(), COLLECTIONS.auditLogs), {
    ...entry,
    createdAt: serverTimestamp(),
  });
}
