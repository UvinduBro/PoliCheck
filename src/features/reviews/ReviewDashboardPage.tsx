import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertOctagon, ClipboardList, FileSearch, Gavel, ScrollText, Users } from "lucide-react";
import { usePendingReviewItems, useResolveCorrectionRequest, useSetClaimReviewStatus, useSetPublicationStatus } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/data/StatCard";
import { EvidenceBadge } from "@/components/evidence/EvidenceBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { TableSkeleton } from "@/components/feedback/Skeleton";

function ReviewSection({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon: ReactNode;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="card">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
        <span className="text-ink-faint">{icon}</span>
        <h2 className="font-semibold text-ink">{title}</h2>
        <span className="chip border-line bg-surface-2 py-0 text-ink-muted">{count}</span>
      </div>
      {count === 0 ? (
        <div className="p-5">
          <EmptyState title="Nothing pending" description="Nothing in this queue right now." />
        </div>
      ) : (
        <ul className="divide-y divide-line">{children}</ul>
      )}
    </section>
  );
}

function ReviewActions({ onApprove, onReject }: { onApprove: () => void; onReject: () => void }) {
  return (
    <div className="flex shrink-0 gap-2">
      <button type="button" className="btn-primary text-xs" onClick={onApprove}>
        Approve &amp; publish
      </button>
      <button type="button" className="btn-secondary text-xs" onClick={onReject}>
        Reject
      </button>
    </div>
  );
}

export function ReviewDashboardPage() {
  const { user } = useAuth();
  const { politicians, cases, investigations, events, claims, correctionRequests, isLoading } = usePendingReviewItems();
  const setPublicationStatus = useSetPublicationStatus(user?.uid ?? "");
  const setClaimStatus = useSetClaimReviewStatus(user?.uid ?? "");
  const resolveCorrectionRequest = useResolveCorrectionRequest(user?.uid ?? "");

  const totalPending =
    politicians.length + cases.length + investigations.length + events.length + claims.length + correctionRequests.length;

  return (
    <div>
      <h1 className="text-page-heading font-semibold text-ink">Reviewer Queue</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-muted">
        {totalPending} item{totalPending === 1 ? "" : "s"} awaiting review. Check identity, source quality, dates,
        case numbers, court names, current status, and whether allegations are clearly labeled before publishing.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Profiles" value={politicians.length} icon={<Users size={16} aria-hidden="true" />} />
        <StatCard label="Cases" value={cases.length} icon={<Gavel size={16} aria-hidden="true" />} />
        <StatCard label="Investigations" value={investigations.length} icon={<FileSearch size={16} aria-hidden="true" />} />
        <StatCard label="Events" value={events.length} icon={<ScrollText size={16} aria-hidden="true" />} />
        <StatCard label="Claims" value={claims.length} icon={<ClipboardList size={16} aria-hidden="true" />} />
        <StatCard label="Corrections" value={correctionRequests.length} icon={<AlertOctagon size={16} aria-hidden="true" />} />
      </div>

      {isLoading ? (
        <div className="mt-6">
          <TableSkeleton rows={6} />
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <ReviewSection title="Politician Profiles" icon={<Users size={16} aria-hidden="true" />} count={politicians.length}>
            {politicians.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <Link to={`/politicians/${p.id}/overview`} className="font-medium text-ink hover:text-accent">
                  {p.fullName} <span className="text-xs font-normal text-ink-faint">({p.country})</span>
                </Link>
                <ReviewActions
                  onApprove={() => setPublicationStatus.mutate({ entityType: "politician", id: p.id, status: "published" })}
                  onReject={() => setPublicationStatus.mutate({ entityType: "politician", id: p.id, status: "draft" })}
                />
              </li>
            ))}
          </ReviewSection>

          <ReviewSection title="Legal Cases" icon={<Gavel size={16} aria-hidden="true" />} count={cases.length}>
            {cases.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <Link to={`/cases/${c.id}`} className="font-medium text-ink hover:text-accent">
                  {c.caseName}
                </Link>
                <ReviewActions
                  onApprove={() => setPublicationStatus.mutate({ entityType: "case", id: c.id, status: "published" })}
                  onReject={() => setPublicationStatus.mutate({ entityType: "case", id: c.id, status: "draft" })}
                />
              </li>
            ))}
          </ReviewSection>

          <ReviewSection title="Investigations" icon={<FileSearch size={16} aria-hidden="true" />} count={investigations.length}>
            {investigations.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <span className="font-medium text-ink">
                  {i.agency} <span className="text-xs font-normal text-ink-faint">— {i.investigationType}</span>
                </span>
                <ReviewActions
                  onApprove={() => setPublicationStatus.mutate({ entityType: "investigation", id: i.id, status: "published" })}
                  onReject={() => setPublicationStatus.mutate({ entityType: "investigation", id: i.id, status: "draft" })}
                />
              </li>
            ))}
          </ReviewSection>

          <ReviewSection title="Timeline Events" icon={<ScrollText size={16} aria-hidden="true" />} count={events.length}>
            {events.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <span className="font-medium text-ink">
                  {e.title} <span className="text-xs font-normal text-ink-faint">({e.date})</span>
                </span>
                <ReviewActions
                  onApprove={() => setPublicationStatus.mutate({ entityType: "legalEvent", id: e.id, status: "published" })}
                  onReject={() => setPublicationStatus.mutate({ entityType: "legalEvent", id: e.id, status: "draft" })}
                />
              </li>
            ))}
          </ReviewSection>

          <ReviewSection title="Claims" icon={<ClipboardList size={16} aria-hidden="true" />} count={claims.length}>
            {claims.map((c) => (
              <li key={c.id} className="flex flex-col gap-2.5 px-5 py-3.5">
                <p className="text-sm text-ink">{c.text}</p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <EvidenceBadge classification={c.classification} />
                  <ReviewActions
                    onApprove={() => setClaimStatus.mutate({ id: c.id, status: "approved" })}
                    onReject={() => setClaimStatus.mutate({ id: c.id, status: "rejected" })}
                  />
                </div>
              </li>
            ))}
          </ReviewSection>

          <ReviewSection title="Reported Errors" icon={<AlertOctagon size={16} aria-hidden="true" />} count={correctionRequests.length}>
            {correctionRequests.map((r) => (
              <li key={r.id} className="flex flex-col gap-2.5 px-5 py-3.5">
                <p className="text-sm text-ink">{r.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link to={`/politicians/${r.politicianId}/overview`} className="text-xs font-medium text-accent hover:underline">
                    View profile
                  </Link>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="btn-primary text-xs"
                      onClick={() => resolveCorrectionRequest.mutate({ id: r.id, status: "resolved" })}
                    >
                      Mark resolved
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-xs"
                      onClick={() => resolveCorrectionRequest.mutate({ id: r.id, status: "dismissed" })}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ReviewSection>
        </div>
      )}
    </div>
  );
}
