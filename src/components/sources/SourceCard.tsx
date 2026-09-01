import { ExternalLink } from "lucide-react";
import { SourceTierBadge } from "./SourceTierBadge";
import { SOURCE_TYPE_LABELS } from "@/constants/sourceTiers";
import { formatDate } from "@/lib/formatting/date";
import type { Source } from "@/types";

const VERIFICATION_LABELS: Record<Source["verificationStatus"], string> = {
  unverified: "Unverified",
  partially_verified: "Partially Verified",
  verified: "Verified",
  disputed: "Disputed",
};

export function SourceCard({ source }: { source: Source }) {
  return (
    <li className="card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-blue-800 hover:underline"
          >
            {source.title}
            <ExternalLink size={14} aria-hidden="true" />
          </a>
          <p className="text-sm text-gray-600">{source.publisher} &middot; {SOURCE_TYPE_LABELS[source.sourceType]}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SourceTierBadge tier={source.tier} />
          <span className="text-xs text-gray-500">{VERIFICATION_LABELS[source.verificationStatus]}</span>
        </div>
      </div>
      {source.summary && <p className="mt-2 text-sm text-gray-700">{source.summary}</p>}
      <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        {source.publicationDate && (
          <div><dt className="inline font-medium">Published:</dt> <dd className="inline">{formatDate(source.publicationDate)}</dd></div>
        )}
        {source.documentDate && (
          <div><dt className="inline font-medium">Document date:</dt> <dd className="inline">{formatDate(source.documentDate)}</dd></div>
        )}
        <div><dt className="inline font-medium">Accessed:</dt> <dd className="inline">{formatDate(source.accessedAt)}</dd></div>
      </dl>
    </li>
  );
}
