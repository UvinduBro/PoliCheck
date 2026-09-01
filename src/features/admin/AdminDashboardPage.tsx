import { Link } from "react-router-dom";
import { useAdminMetrics, useAllUsers, usePoliticiansWithIdentityConflicts, useRecentAuditLogs, useSetUserActive, useSetUserRole } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS, USER_ROLES } from "@/constants/roles";
import { formatDate } from "@/lib/formatting/date";
import type { UserRole } from "@/types";

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 text-center">
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: users = [], isLoading: usersLoading } = useAllUsers();
  const { data: auditLogs = [] } = useRecentAuditLogs();
  const { data: unresolvedIdentity = [] } = usePoliticiansWithIdentityConflicts();
  const setRole = useSetUserRole(user?.uid ?? "");
  const setActive = useSetUserActive(user?.uid ?? "");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Administration</h1>
        <p className="mt-1 text-sm text-gray-600">
          Aggregate statistics only — presented as counts, never as an implication of guilt.
        </p>
      </div>

      <section>
        <h2 className="font-semibold text-gray-900">Dashboard Metrics</h2>
        {metricsLoading ? (
          <p className="mt-2 text-sm text-gray-500">Loading metrics...</p>
        ) : (
          metrics && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Published Profiles" value={metrics.publishedPoliticians} />
              <StatTile label="Profiles Awaiting Review" value={metrics.pendingPoliticians} />
              <StatTile label="Convictions" value={metrics.convictions} />
              <StatTile label="Acquittals" value={metrics.acquittals} />
              <StatTile label="Pending Appeals" value={metrics.pendingAppeals} />
              <StatTile label="Open Investigations" value={metrics.openInvestigations} />
              <StatTile label="Unresolved Identity Conflicts" value={unresolvedIdentity.length} />
              <StatTile label="Tier 1 / 4 Sources" value={`${metrics.sourcesByTier[1]} / ${metrics.sourcesByTier[4]}`} />
            </div>
          )
        )}
      </section>

      {unresolvedIdentity.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-900">Profiles with Unresolved Identity Conflicts</h2>
          <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
            {unresolvedIdentity.map((p) => (
              <li key={p.id} className="px-4 py-2 text-sm">
                <Link to={`/politicians/${p.id}/overview`} className="text-blue-800 hover:underline">
                  {p.fullName}
                </Link>{" "}
                <span className="text-gray-500">({p.country})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-semibold text-gray-900">Users &amp; Roles</h2>
        {usersLoading ? (
          <p className="mt-2 text-sm text-gray-500">Loading users...</p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-md border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Role</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.uid}>
                    <td className="px-4 py-2">{u.displayName || "—"}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">
                      <select
                        aria-label={`Role for ${u.displayName || u.email}`}
                        className="input"
                        value={u.role}
                        onChange={(e) => setRole.mutate({ uid: u.uid, role: e.target.value as UserRole })}
                      >
                        {USER_ROLES.map((role) => (
                          <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setActive.mutate({ uid: u.uid, isActive: !u.isActive })}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-gray-900">Recent Audit Log</h2>
        <div className="mt-2 max-h-96 overflow-y-auto rounded-md border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">When</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Actor</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Action</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-2">{formatDate(log.createdAt, "d MMM yyyy HH:mm")}</td>
                  <td className="px-4 py-2">{log.actorId}</td>
                  <td className="px-4 py-2">{log.action}</td>
                  <td className="px-4 py-2">{log.entityType} / {log.entityId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
