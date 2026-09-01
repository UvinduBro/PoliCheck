import { Link } from "react-router-dom";
import { useAdminMetrics, useAllUsers, usePoliticiansWithIdentityConflicts, useRecentAuditLogs, useSetUserActive, useSetUserRole } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS, USER_ROLES } from "@/constants/roles";
import { formatDate } from "@/lib/formatting/date";
import type { UserRole } from "@/types";

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center">
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
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
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Administration</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Aggregate statistics only — presented as counts, never as an implication of guilt.
        </p>
      </div>

      <section>
        <h2 className="font-semibold text-slate-900 dark:text-white">Dashboard Metrics</h2>
        {metricsLoading ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading metrics...</p>
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
          <h2 className="font-semibold text-slate-900 dark:text-white">Profiles with Unresolved Identity Conflicts</h2>
          <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {unresolvedIdentity.map((p) => (
              <li key={p.id} className="px-4 py-2 text-sm">
                <Link to={`/politicians/${p.id}/overview`} className="text-brand-700 hover:underline dark:text-brand-400">
                  {p.fullName}
                </Link>{" "}
                <span className="text-slate-500 dark:text-slate-400">({p.country})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-semibold text-slate-900 dark:text-white">Users &amp; Roles</h2>
        {usersLoading ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading users...</p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Email</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Role</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
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
        <h2 className="font-semibold text-slate-900 dark:text-white">Recent Audit Log</h2>
        <div className="mt-2 max-h-96 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">When</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Actor</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Action</th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
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
