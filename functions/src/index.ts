import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

initializeApp();

const VALID_ROLES = new Set(["public", "researcher", "reviewer", "admin"]);

/**
 * Firestore security rules (firestore.rules) authorize purely off the "role" custom
 * claim on the auth token — never off the client-writable users/{uid}.role field.
 * This trigger keeps that claim in sync whenever a user's Firestore profile changes,
 * so a promotion/demotion made by an admin actually takes effect.
 */
export const syncUserRoleClaim = onDocumentWritten("users/{uid}", async (event) => {
  const uid = event.params.uid;
  const after = event.data?.after.data();

  if (!after) return; // profile deleted — leave existing claims as-is (account deletion handles this separately)

  const role = typeof after.role === "string" && VALID_ROLES.has(after.role) ? after.role : "public";

  const auth = getAuth();
  const user = await auth.getUser(uid);
  if (user.customClaims?.role === role) return; // no-op, avoid unnecessary token churn

  await auth.setCustomUserClaims(uid, { ...user.customClaims, role });
});
