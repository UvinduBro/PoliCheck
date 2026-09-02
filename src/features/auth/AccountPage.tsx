import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { deleteAccount, signOut, updateDisplayName } from "@/lib/firebase/auth";
import { formatDate } from "@/lib/formatting/date";

export function AccountPage() {
  const { t } = useTranslation();
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
      <h1 className="text-page-heading font-semibold text-ink">{t("account.title")}</h1>
      <dl className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface">
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <dt className="text-ink-muted">{t("account.name")}</dt>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                className="input h-8 w-40 py-1 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <button type="button" className="btn-primary h-8 px-3 text-xs" onClick={saveName} disabled={saving}>
                {saving ? t("account.saving") : t("account.save")}
              </button>
              <button
                type="button"
                className="btn-secondary h-8 px-3 text-xs"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                {t("account.cancel")}
              </button>
            </div>
          ) : (
            <dd className="flex items-center gap-3 font-medium text-ink">
              {userProfile?.displayName || user.displayName || t("account.notSet")}
              <button type="button" className="text-xs font-medium text-accent hover:underline" onClick={startEditing}>
                {t("account.editProfile")}
              </button>
            </dd>
          )}
        </div>
        {nameError && <p className="px-4 py-2 text-sm text-status-critical">{nameError}</p>}
        <div className="flex justify-between px-4 py-3 text-sm">
          <dt className="text-ink-muted">{t("account.email")}</dt>
          <dd className="font-medium text-ink">{user.email}</dd>
        </div>
        <div className="flex justify-between px-4 py-3 text-sm">
          <dt className="text-ink-muted">{t("account.role")}</dt>
          <dd className="font-medium text-ink">{t(`roles.${userProfile?.role ?? "public"}`)}</dd>
        </div>
        {userProfile?.createdAt && (
          <div className="flex justify-between px-4 py-3 text-sm">
            <dt className="text-ink-muted">{t("account.memberSince")}</dt>
            <dd className="font-medium text-ink">{formatDate(userProfile.createdAt)}</dd>
          </div>
        )}
      </dl>

      <button type="button" className="btn-secondary mt-8" onClick={() => signOut()}>
        {t("account.signOut")}
      </button>

      <div className="mt-10 rounded-lg border border-status-critical/25 bg-status-critical-bg/40 p-4">
        <h2 className="text-sm font-semibold text-status-critical">{t("account.deleteAccountHeading")}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t("account.deleteAccountBody")}</p>
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
                {deleting ? t("account.deleting") : t("account.confirmDeleteAccount")}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
              >
                {t("account.cancel")}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-secondary border-status-critical/40 text-status-critical hover:bg-status-critical-bg"
              onClick={() => setConfirmingDelete(true)}
            >
              {t("account.deleteAccount")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
