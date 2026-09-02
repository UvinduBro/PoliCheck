import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

initializeApp();

const VALID_ROLES = new Set(["public", "researcher", "reviewer", "admin"]);

/**
 * Not required for authorization: firestore.rules now reads each caller's role live from
 * their own users/{uid} document, so a role change takes effect immediately with no token
 * refresh needed and no dependency on this function being deployed. This trigger is kept as
 * optional defense-in-depth for anything that might check the auth token's role claim
 * outside of Firestore rules (e.g. a future custom backend) — deploying it is not required
 * for the app to work.
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
