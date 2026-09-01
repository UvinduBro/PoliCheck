import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types";

const ROLE_RANK: Record<UserRole, number> = { public: 0, researcher: 1, reviewer: 2, admin: 3 };

export function RequireRole({ minimum, children }: { minimum: UserRole; children: ReactNode }) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-sm text-ink-muted">Checking access...</div>;
  }
  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }
  if (ROLE_RANK[userProfile.role] < ROLE_RANK[minimum]) {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <h1 className="text-lg font-semibold text-ink">Access restricted</h1>
        <p className="mt-2 text-sm text-ink-muted">
          This page requires the &ldquo;{minimum}&rdquo; role or higher. Your account role is &ldquo;{userProfile.role}&rdquo;.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
