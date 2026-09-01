import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FreedomStatusBadge } from "@/components/status/FreedomStatusBadge";
import { ConfidenceBadge } from "@/components/status/ConfidenceBadge";
import { FREEDOM_STATUS_STATEMENT } from "@/constants/legalStatus";
import { formatDate } from "@/lib/formatting/date";
import type { FreedomStatus } from "@/types";
import type { Timestamp } from "firebase/firestore";

export function LegalStatusCard({
  status,
  confidence,
  lastVerified,
  hasConflict,
  evidenceHref,
}: {
  status: FreedomStatus;
  confidence: "high" | "medium" | "low" | "unresolved";
  lastVerified?: string | Timestamp;
  hasConflict?: boolean;
  evidenceHref: string;
}) {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-line bg-surface-2/40 px-6 py-3">
        <p className="eyebrow">Current legal status</p>
      </div>
      <div className="px-6 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <FreedomStatusBadge status={status} className="px-3 py-1.5 text-sm" />
        </div>
        <p className="mt-3 text-xl font-medium leading-snug text-ink sm:text-2xl">
          {FREEDOM_STATUS_STATEMENT[status]}
        </p>

        {hasConflict && (
          <p className="mt-3 rounded-md bg-status-pending-bg px-3 py-2 text-sm text-status-pending">
            Sources disagree about this status — marked unresolved pending reviewer confirmation.
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
          <span>
            Last verified: <span className="font-medium text-ink">{lastVerified ? formatDate(lastVerified) : "Not yet verified"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            Source confidence: <ConfidenceBadge level={confidence} />
          </span>
        </div>

        <Link
          to={evidenceHref}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          View evidence
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
