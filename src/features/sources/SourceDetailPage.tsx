import { ExternalLink, Archive, FileText, ScrollText } from "lucide-react";
import { useParams } from "react-router-dom";
import { useSource } from "./api";
import { SourceTierBadge } from "@/components/sources/SourceTierBadge";
import { ErrorState } from "@/components/feedback/ErrorState";
import { CardSkeleton, Skeleton } from "@/components/feedback/Skeleton";
import { SOURCE_TIER_DESCRIPTIONS, SOURCE_TYPE_LABELS, TIER_1_SOURCE_TYPES } from "@/constants/sourceTiers";
import { formatDate } from "@/lib/formatting/date";

const VERIFICATION_LABELS: Record<string, string> = {
  unverified: "Unverified",
  partially_verified: "Partially verified",
  verified: "Verified",
  disputed: "Disputed",
};

const VERIFICATION_CLASSES: Record<string, string> = {
  unverified: "text-ink-muted",
  partially_verified: "text-status-pending",
  verified: "text-status-verified",
  disputed: "text-status-critical",
};

export function SourceDetailPage() {
  const { sourceId } = useParams();
  const { data: source, isLoading, error } = useSource(sourceId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/3" />
        <div className="mt-6">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !source) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorState
          title="Source not found"
          description="This source could not be found, or you do not have access to view it."
        />
      </div>
    );
  }

  const isPrimary = TIER_1_SOURCE_TYPES.includes(source.sourceType);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card overflow-hidden">
        {isPrimary && (
          <div className="flex items-center gap-1.5 border-b border-status-verified/20 bg-status-verified-bg px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-status-verified">
            <ScrollText size={12} aria-hidden="true" />
            {SOURCE_TYPE_LABELS[source.sourceType]} · Primary source
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-lg font-semibold leading-snug text-ink sm:text-xl">{source.title}</h1>
            <SourceTierBadge tier={source.tier} />
          </div>

          <p className="mt-1.5 text-sm text-ink-muted">
            {source.publisher}
            {!isPrimary && ` · ${SOURCE_TYPE_LABELS[source.sourceType]}`}
            {source.author && ` · ${source.author}`}
          </p>
          <p className="mt-2 text-xs text-ink-faint">{SOURCE_TIER_DESCRIPTIONS[source.tier]}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary gap-1.5 text-sm"
            >
              <ExternalLink size={14} aria-hidden="true" />
              View original source
            </a>
            {source.archiveUrl && (
              <a
                href={source.archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost gap-1.5 text-sm"
              >
                <Archive size={14} aria-hidden="true" />
                View archived copy
              </a>
            )}
          </div>

          {source.summary && (
            <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-ink">{source.summary}</p>
          )}

          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">Publication date</dt>
              <dd className="mt-0.5 text-ink">{source.publicationDate ? formatDate(source.publicationDate) : "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">Document date</dt>
              <dd className="mt-0.5 text-ink">{source.documentDate ? formatDate(source.documentDate) : "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">Accessed</dt>
              <dd className="mt-0.5 text-ink">{formatDate(source.accessedAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">Verification status</dt>
              <dd className={`mt-0.5 font-medium ${VERIFICATION_CLASSES[source.verificationStatus] ?? "text-ink"}`}>
                {VERIFICATION_LABELS[source.verificationStatus] ?? source.verificationStatus}
              </dd>
            </div>
          </dl>

          {source.notes && (
            <div className="mt-5 flex gap-2 rounded-lg border border-line bg-surface-2 p-3 text-xs text-ink-muted">
              <FileText size={14} className="mt-0.5 shrink-0 text-ink-faint" aria-hidden="true" />
              <p>
                <span className="font-medium text-ink">Notes:</span> {source.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
