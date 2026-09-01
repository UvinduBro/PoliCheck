import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { resendEmailVerification, signOut } from "@/lib/firebase/auth";
import { ROLE_LABELS } from "@/constants/roles";
import { formatDate } from "@/lib/formatting/date";

export function AccountPage() {
  const { user, userProfile, loading } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading account...</div>;
  if (!user) return <Navigate to="/login" replace />;

  async function onResendVerification() {
    await resendEmailVerification();
    setMessage("Verification email sent.");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-xl font-semibold text-gray-900">Account</h1>
      <dl className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        <div className="flex justify-between px-4 py-3 text-sm">
          <dt className="text-gray-500">Name</dt>
          <dd className="font-medium text-gray-900">{userProfile?.displayName || user.displayName || "—"}</dd>
        </div>
        <div className="flex justify-between px-4 py-3 text-sm">
          <dt className="text-gray-500">Email</dt>
          <dd className="font-medium text-gray-900">{user.email}</dd>
        </div>
        <div className="flex justify-between px-4 py-3 text-sm">
          <dt className="text-gray-500">Role</dt>
          <dd className="font-medium text-gray-900">{ROLE_LABELS[userProfile?.role ?? "public"]}</dd>
        </div>
        <div className="flex justify-between px-4 py-3 text-sm">
          <dt className="text-gray-500">Email verified</dt>
          <dd className="font-medium text-gray-900">{user.emailVerified ? "Yes" : "No"}</dd>
        </div>
        {userProfile?.createdAt && (
          <div className="flex justify-between px-4 py-3 text-sm">
            <dt className="text-gray-500">Member since</dt>
            <dd className="font-medium text-gray-900">{formatDate(userProfile.createdAt)}</dd>
          </div>
        )}
      </dl>

      {!user.emailVerified && (
        <button type="button" className="btn-secondary mt-4" onClick={onResendVerification}>
          Resend verification email
        </button>
      )}
      {message && <p role="status" className="mt-2 text-sm text-green-700">{message}</p>}

      <button type="button" className="btn-secondary mt-8" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
}
