import { ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import { useSource } from "./api";
import { SourceTierBadge } from "@/components/sources/SourceTierBadge";
import { SOURCE_TIER_DESCRIPTIONS, SOURCE_TYPE_LABELS } from "@/constants/sourceTiers";
import { formatDate } from "@/lib/formatting/date";

export function SourceDetailPage() {
  const { sourceId } = useParams();
  const { data: source, isLoading, error } = useSource(sourceId);

  if (isLoading) return <p className="text-sm text-gray-500">Loading source...</p>;
  if (error || !source) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        This source could not be found, or you do not have access to view it.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">{source.title}</h1>
        <SourceTierBadge tier={source.tier} />
      </div>
      <p className="mt-1 text-sm text-gray-600">{source.publisher} &middot; {SOURCE_TYPE_LABELS[source.sourceType]}</p>
      <p className="mt-2 text-xs text-gray-500">{SOURCE_TIER_DESCRIPTIONS[source.tier]}</p>

      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-blue-800 hover:underline"
      >
        View original source <ExternalLink size={14} aria-hidden="true" />
      </a>
      {source.archiveUrl && (
        <a
          href={source.archiveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1 text-blue-800 hover:underline"
        >
          View archived copy <ExternalLink size={14} aria-hidden="true" />
        </a>
      )}

      {source.summary && <p className="mt-4 text-sm text-gray-800">{source.summary}</p>}

      <dl className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white text-sm">
        <div className="flex justify-between px-4 py-2">
          <dt className="text-gray-500">Publication date</dt>
          <dd>{source.publicationDate ? formatDate(source.publicationDate) : "Unknown"}</dd>
        </div>
        <div className="flex justify-between px-4 py-2">
          <dt className="text-gray-500">Document date</dt>
          <dd>{source.documentDate ? formatDate(source.documentDate) : "N/A"}</dd>
        </div>
        <div className="flex justify-between px-4 py-2">
          <dt className="text-gray-500">Accessed</dt>
          <dd>{formatDate(source.accessedAt)}</dd>
        </div>
        <div className="flex justify-between px-4 py-2">
          <dt className="text-gray-500">Verification status</dt>
          <dd className="capitalize">{source.verificationStatus.replace("_", " ")}</dd>
        </div>
      </dl>
      {source.notes && (
        <p className="mt-4 text-xs text-gray-500"><span className="font-medium">Notes:</span> {source.notes}</p>
      )}
    </div>
  );
}
