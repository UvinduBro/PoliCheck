import type { PublicationStatus, ReviewStatus, UserRole } from "@/types";

const ROLE_RANK: Record<UserRole, number> = {
  public: 0,
  researcher: 1,
  reviewer: 2,
  admin: 3,
};

function atLeast(role: UserRole | undefined, minimum: UserRole): boolean {
  return ROLE_RANK[role ?? "public"] >= ROLE_RANK[minimum];
}

export const can = {
  /** Registered researcher or above: create politicians, cases, sources, drafts. */
  createRecords: (role?: UserRole) => atLeast(role, "researcher"),
  editOwnDrafts: (role?: UserRole) => atLeast(role, "researcher"),
  uploadSources: (role?: UserRole) => atLeast(role, "researcher"),
  /** Reviewer or above: approve/reject/publish, mark claim classification. */
  reviewRecords: (role?: UserRole) => atLeast(role, "reviewer"),
  publishRecords: (role?: UserRole) => atLeast(role, "reviewer"),
  /** Admin only: manage users/roles, taxonomies, audit logs, remove content. */
  manageUsers: (role?: UserRole) => atLeast(role, "admin"),
  viewAuditLogs: (role?: UserRole) => atLeast(role, "admin"),
  deleteRecords: (role?: UserRole) => atLeast(role, "admin"),
  configureSettings: (role?: UserRole) => atLeast(role, "admin"),
};

/** Mirrors the Firestore security rule: published content is public, everything else requires researcher+. */
export function canReadByPublicationStatus(
  status: PublicationStatus,
  role?: UserRole,
): boolean {
  if (status === "published") return true;
  return atLeast(role, "researcher");
}

export function canReadClaimByReviewStatus(
  status: ReviewStatus,
  role?: UserRole,
): boolean {
  if (status === "approved") return true;
  return atLeast(role, "researcher");
}
