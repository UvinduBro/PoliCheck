import { Link } from "react-router-dom";
import { useAdminMetrics, useAllUsers, usePoliticiansWithIdentityConflicts, useRecentAuditLogs, useSetUserActive, useSetUserRole } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureFlags, useUpdateFeatureFlags } from "@/features/settings/api";
import { FEATURE_FLAG_DESCRIPTIONS, FEATURE_FLAG_KEYS, FEATURE_FLAG_LABELS } from "@/constants/featureFlags";
import { ROLE_LABELS, USER_ROLES } from "@/constants/roles";
import { formatDate } from "@/lib/formatting/date";
import { StatCard } from "@/components/data/StatCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { TableSkeleton } from "@/components/feedback/Skeleton";
import type { UserRole } from "@/types";

function FeatureFlagsSection() {
  const { user } = useAuth();
  const { flags, isLoading } = useFeatureFlags();
  const updateFlags = useUpdateFeatureFlags(user?.uid ?? "");

  return (
    <section>
      <h2 className="text-section-heading font-semibold text-ink">Features</h2>
      <p className="mt-1 max-w-2xl text-sm text-ink-muted">
        Everything below is off by default for initial launch, which is scoped to politician profiles, legal
        cases, and allegations only. Nothing is deleted when a feature is off — its data, routes, and code stay
        in place, just hidden from navigation until you turn it back on here.
      </p>
      {isLoading ? (
        <div className="mt-3">
          <TableSkeleton rows={3} />
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-surface">
          {FEATURE_FLAG_KEYS.map((key) => (
            <li key={key} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{FEATURE_FLAG_LABELS[key]}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{FEATURE_FLAG_DESCRIPTIONS[key]}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={flags[key]}
                aria-label={`${flags[key] ? "Disable" : "Enable"} ${FEATURE_FLAG_LABELS[key]}`}
                onClick={() => updateFlags.mutate({ ...flags, [key]: !flags[key] })}
                disabled={updateFlags.isPending}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                  flags[key] ? "bg-accent" : "bg-surface-2 border border-line"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    flags[key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
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
        <h1 className="text-page-heading font-semibold text-ink">Administration</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Aggregate statistics only — presented as counts, never as an implication of guilt.
        </p>
      </div>

      <FeatureFlagsSection />

      <section>
        <h2 className="text-section-heading font-semibold text-ink">Dashboard Metrics</h2>
        {metricsLoading ? (
          <div className="mt-3">
            <TableSkeleton rows={2} />
          </div>
        ) : (
          metrics && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Published Profiles" value={metrics.publishedPoliticians} />
              <StatCard label="Awaiting Review" value={metrics.pendingPoliticians} />
              <StatCard label="Convictions" value={metrics.convictions} />
              <StatCard label="Acquittals" value={metrics.acquittals} />
              <StatCard label="Pending Appeals" value={metrics.pendingAppeals} />
              <StatCard label="Open Investigations" value={metrics.openInvestigations} />
              <StatCard label="Identity Conflicts" value={unresolvedIdentity.length} />
              <StatCard label="Tier 1 / 4 Sources" value={`${metrics.sourcesByTier[1]} / ${metrics.sourcesByTier[4]}`} />
            </div>
          )
        )}
      </section>

      {unresolvedIdentity.length > 0 && (
        <section>
          <h2 className="text-section-heading font-semibold text-ink">Profiles with Unresolved Identity Conflicts</h2>
          <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-surface">
            {unresolvedIdentity.map((p) => (
              <li key={p.id} className="px-4 py-2.5 text-sm">
                <Link to={`/politicians/${p.id}/overview`} className="font-medium text-ink hover:text-accent">
                  {p.fullName}
                </Link>{" "}
                <span className="text-ink-faint">({p.country})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-section-heading font-semibold text-ink">Users &amp; Roles</h2>
        {usersLoading ? (
          <div className="mt-3">
            <TableSkeleton rows={5} />
          </div>
        ) : users.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No users found" />
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-surface-2">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">Name</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">Email</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">Role</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-surface-2/60">
                    <td className="px-4 py-2.5 font-medium text-ink">{u.displayName || "—"}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{u.email}</td>
                    <td className="px-4 py-2.5">
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
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        className="btn-secondary text-xs"
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
        <h2 className="text-section-heading font-semibold text-ink">Recent Audit Log</h2>
        {auditLogs.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No audit activity yet" />
          </div>
        ) : (
          <div className="mt-3 max-h-96 overflow-y-auto rounded-lg border border-line bg-surface">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="sticky top-0 bg-surface-2">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">When</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">Actor</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">Action</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-2/60">
                    <td className="whitespace-nowrap px-4 py-2.5 text-ink-muted">{formatDate(log.createdAt, "d MMM yyyy HH:mm")}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{log.actorId}</td>
                    <td className="px-4 py-2.5 font-medium text-ink">{log.action}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{log.entityType} / {log.entityId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
