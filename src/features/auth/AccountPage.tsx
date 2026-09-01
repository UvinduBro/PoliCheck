import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/firebase/auth";
import { ROLE_LABELS } from "@/constants/roles";
import { formatDate } from "@/lib/formatting/date";

export function AccountPage() {
  const { user, userProfile, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-sm text-ink-muted">Loading account...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-page-heading font-semibold text-ink">Account</h1>
      <dl className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface">
        <div className="flex justify-between px-4 py-3 text-sm">
          <dt className="text-ink-muted">Name</dt>
          <dd className="font-medium text-ink">{userProfile?.displayName || user.displayName || "—"}</dd>
        </div>
        <div className="flex justify-between px-4 py-3 text-sm">
          <dt className="text-ink-muted">Email</dt>
          <dd className="font-medium text-ink">{user.email}</dd>
        </div>
        <div className="flex justify-between px-4 py-3 text-sm">
          <dt className="text-ink-muted">Role</dt>
          <dd className="font-medium text-ink">{ROLE_LABELS[userProfile?.role ?? "public"]}</dd>
        </div>
        {userProfile?.createdAt && (
          <div className="flex justify-between px-4 py-3 text-sm">
            <dt className="text-ink-muted">Member since</dt>
            <dd className="font-medium text-ink">{formatDate(userProfile.createdAt)}</dd>
          </div>
        )}
      </dl>

      <button type="button" className="btn-secondary mt-8" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
}
