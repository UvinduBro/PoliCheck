import { ExternalLink, ScrollText } from "lucide-react";
import { SourceTierBadge } from "./SourceTierBadge";
import { SOURCE_TYPE_LABELS, TIER_1_SOURCE_TYPES } from "@/constants/sourceTiers";
import { formatDate } from "@/lib/formatting/date";
import type { Source } from "@/types";

const VERIFICATION_LABELS: Record<Source["verificationStatus"], string> = {
  unverified: "Unverified",
  partially_verified: "Partially Verified",
  verified: "Verified",
  disputed: "Disputed",
};

export function SourceCard({ source }: { source: Source }) {
  const isPrimary = TIER_1_SOURCE_TYPES.includes(source.sourceType);

  return (
    <li className={`card overflow-hidden ${isPrimary ? "border-status-verified/30" : ""}`}>
      {isPrimary && (
        <div className="flex items-center gap-1.5 border-b border-status-verified/20 bg-status-verified-bg px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-status-verified">
          <ScrollText size={12} aria-hidden="true" />
          {SOURCE_TYPE_LABELS[source.sourceType]} · Primary source
        </div>
      )}
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-ink hover:text-accent"
            >
              {source.title}
              <ExternalLink size={13} className="shrink-0 text-ink-faint" aria-hidden="true" />
            </a>
            <p className="mt-0.5 text-sm text-ink-muted">
              {source.publisher}
              {!isPrimary && ` · ${SOURCE_TYPE_LABELS[source.sourceType]}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SourceTierBadge tier={source.tier} />
          </div>
        </div>
        {source.summary && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{source.summary}</p>}
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-faint">
          {source.publicationDate && (
            <div>
              <dt className="inline font-medium">Published:</dt> <dd className="inline">{formatDate(source.publicationDate)}</dd>
            </div>
          )}
          {source.documentDate && (
            <div>
              <dt className="inline font-medium">Document date:</dt> <dd className="inline">{formatDate(source.documentDate)}</dd>
            </div>
          )}
          <div>
            <dt className="inline font-medium">Accessed:</dt> <dd className="inline">{formatDate(source.accessedAt)}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Status:</dt> <dd className="inline">{VERIFICATION_LABELS[source.verificationStatus]}</dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
