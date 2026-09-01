import type { UserRole } from "@/types";

export const USER_ROLES: UserRole[] = ["public", "researcher", "reviewer", "admin"];

export const ROLE_LABELS: Record<UserRole, string> = {
  public: "Public User",
  researcher: "Registered Researcher",
  reviewer: "Reviewer",
  admin: "Administrator",
};
