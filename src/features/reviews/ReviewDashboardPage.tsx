import { Link } from "react-router-dom";
import { usePendingReviewItems, useResolveCorrectionRequest, useSetClaimReviewStatus, useSetPublicationStatus } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { CLAIM_CLASSIFICATION_LABELS } from "@/constants/legalStatus";

export function ReviewDashboardPage() {
  const { user } = useAuth();
  const { politicians, cases, investigations, events, claims, correctionRequests, isLoading } = usePendingReviewItems();
  const setPublicationStatus = useSetPublicationStatus(user?.uid ?? "");
  const setClaimStatus = useSetClaimReviewStatus(user?.uid ?? "");
  const resolveCorrectionRequest = useResolveCorrectionRequest(user?.uid ?? "");

  const totalPending =
    politicians.length + cases.length + investigations.length + events.length + claims.length + correctionRequests.length;

  if (isLoading) return <p className="text-sm text-slate-500 dark:text-slate-400">Loading review queue...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Reviewer Queue</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {totalPending} item(s) awaiting review. Check identity, source quality, dates, case numbers, court
        names, current status, and whether allegations are clearly labeled before publishing.
      </p>

      <section className="mt-6">
        <h2 className="font-semibold text-slate-900 dark:text-white">Politician Profiles</h2>
        {politicians.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {politicians.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3">
                <Link to={`/politicians/${p.id}/overview`} className="text-brand-700 hover:underline dark:text-brand-400">
                  {p.fullName} <span className="text-xs text-slate-500 dark:text-slate-400">({p.country})</span>
                </Link>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setPublicationStatus.mutate({ entityType: "politician", id: p.id, status: "published" })}
                  >
                    Approve &amp; publish
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setPublicationStatus.mutate({ entityType: "politician", id: p.id, status: "draft" })}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-slate-900 dark:text-white">Legal Cases</h2>
        {cases.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {cases.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-3">
                <Link to={`/cases/${c.id}`} className="text-brand-700 hover:underline dark:text-brand-400">{c.caseName}</Link>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setPublicationStatus.mutate({ entityType: "case", id: c.id, status: "published" })}
                  >
                    Approve &amp; publish
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setPublicationStatus.mutate({ entityType: "case", id: c.id, status: "draft" })}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-slate-900 dark:text-white">Investigations</h2>
        {investigations.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {investigations.map((i) => (
              <li key={i.id} className="flex items-center justify-between px-4 py-3">
                <span>{i.agency} — {i.investigationType}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setPublicationStatus.mutate({ entityType: "investigation", id: i.id, status: "published" })}
                  >
                    Approve &amp; publish
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setPublicationStatus.mutate({ entityType: "investigation", id: i.id, status: "draft" })}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-slate-900 dark:text-white">Timeline Events</h2>
        {events.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {events.map((e) => (
              <li key={e.id} className="flex items-center justify-between px-4 py-3">
                <span>{e.title} ({e.date})</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setPublicationStatus.mutate({ entityType: "legalEvent", id: e.id, status: "published" })}
                  >
                    Approve &amp; publish
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setPublicationStatus.mutate({ entityType: "legalEvent", id: e.id, status: "draft" })}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-slate-900 dark:text-white">Claims</h2>
        {claims.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {claims.map((c) => (
              <li key={c.id} className="px-4 py-3">
                <p className="text-sm text-slate-900 dark:text-white">{c.text}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{CLAIM_CLASSIFICATION_LABELS[c.classification]}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setClaimStatus.mutate({ id: c.id, status: "approved" })}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setClaimStatus.mutate({ id: c.id, status: "rejected" })}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-slate-900 dark:text-white">Reported Errors</h2>
        {correctionRequests.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {correctionRequests.map((r) => (
              <li key={r.id} className="px-4 py-3">
                <p className="text-sm text-slate-900 dark:text-white">{r.description}</p>
                <Link to={`/politicians/${r.politicianId}/overview`} className="text-xs text-brand-700 hover:underline dark:text-brand-400">
                  View profile
                </Link>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => resolveCorrectionRequest.mutate({ id: r.id, status: "resolved" })}
                  >
                    Mark resolved
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => resolveCorrectionRequest.mutate({ id: r.id, status: "dismissed" })}
                  >
                    Dismiss
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
