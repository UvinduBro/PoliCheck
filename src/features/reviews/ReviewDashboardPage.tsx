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

  if (isLoading) return <p className="text-sm text-gray-500">Loading review queue...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900">Reviewer Queue</h1>
      <p className="mt-1 text-sm text-gray-600">
        {totalPending} item(s) awaiting review. Check identity, source quality, dates, case numbers, court
        names, current status, and whether allegations are clearly labeled before publishing.
      </p>

      <section className="mt-6">
        <h2 className="font-semibold text-gray-900">Politician Profiles</h2>
        {politicians.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
            {politicians.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3">
                <Link to={`/politicians/${p.id}/overview`} className="text-blue-800 hover:underline">
                  {p.fullName} <span className="text-xs text-gray-500">({p.country})</span>
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
        <h2 className="font-semibold text-gray-900">Legal Cases</h2>
        {cases.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
            {cases.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-3">
                <Link to={`/cases/${c.id}`} className="text-blue-800 hover:underline">{c.caseName}</Link>
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
        <h2 className="font-semibold text-gray-900">Investigations</h2>
        {investigations.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
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
        <h2 className="font-semibold text-gray-900">Timeline Events</h2>
        {events.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
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
        <h2 className="font-semibold text-gray-900">Claims</h2>
        {claims.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
            {claims.map((c) => (
              <li key={c.id} className="px-4 py-3">
                <p className="text-sm text-gray-900">{c.text}</p>
                <p className="text-xs text-gray-500">{CLAIM_CLASSIFICATION_LABELS[c.classification]}</p>
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
        <h2 className="font-semibold text-gray-900">Reported Errors</h2>
        {correctionRequests.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Nothing pending.</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
            {correctionRequests.map((r) => (
              <li key={r.id} className="px-4 py-3">
                <p className="text-sm text-gray-900">{r.description}</p>
                <Link to={`/politicians/${r.politicianId}/overview`} className="text-xs text-blue-800 hover:underline">
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
