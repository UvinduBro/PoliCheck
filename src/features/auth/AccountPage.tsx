import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { deleteAccount, signOut, updateDisplayName } from "@/lib/firebase/auth";
import { ROLE_LABELS } from "@/constants/roles";
import { formatDate } from "@/lib/formatting/date";

export function AccountPage() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (loading) return <div className="p-8 text-center text-sm text-ink-muted">Loading account...</div>;
  if (!user) return <Navigate to="/login" replace />;

  function startEditing() {
    setName(userProfile?.displayName || user?.displayName || "");
    setNameError(null);
    setEditing(true);
  }

  async function saveName() {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    setNameError(null);
    try {
      await updateDisplayName(user!, trimmed);
      setEditing(false);
    } catch (e) {
      setNameError(e instanceof Error ? e.message : "Could not update your name.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount(user!);
      navigate("/");
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Could not delete your account.");
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-page-heading font-semibold text-ink">Account</h1>
      <dl className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface">
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <dt className="text-ink-muted">Name</dt>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                className="input h-8 w-40 py-1 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <button type="button" className="btn-primary h-8 px-3 text-xs" onClick={saveName} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="btn-secondary h-8 px-3 text-xs"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          ) : (
            <dd className="flex items-center gap-3 font-medium text-ink">
              {userProfile?.displayName || user.displayName || "—"}
              <button type="button" className="text-xs font-medium text-accent hover:underline" onClick={startEditing}>
                Edit profile
              </button>
            </dd>
          )}
        </div>
        {nameError && <p className="px-4 py-2 text-sm text-status-critical">{nameError}</p>}
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

      <div className="mt-10 rounded-lg border border-status-critical/25 bg-status-critical-bg/40 p-4">
        <h2 className="text-sm font-semibold text-status-critical">Delete account</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Permanently deletes your account and profile. Research records you've contributed to the site are not
          removed. This cannot be undone.
        </p>
        {deleteError && <p className="mt-2 text-sm text-status-critical">{deleteError}</p>}
        <div className="mt-3 flex items-center gap-2">
          {confirmingDelete ? (
            <>
              <button
                type="button"
                className="btn-secondary border-status-critical/40 text-status-critical hover:bg-status-critical-bg"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Confirm delete account"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-secondary border-status-critical/40 text-status-critical hover:bg-status-critical-bg"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
