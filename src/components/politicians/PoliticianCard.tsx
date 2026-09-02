import { Link } from "react-router-dom";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { formatDate } from "@/lib/formatting/date";
import type { CustodyStatus, Politician } from "@/types";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const source = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);
  return source.toUpperCase();
}

const CUSTODY_LABELS: Partial<Record<CustodyStatus, string>> = {
  jailed: "Jailed",
  bailed: "On bail",
};

const CUSTODY_CLASSES: Partial<Record<CustodyStatus, string>> = {
  jailed: "border-status-critical/25 bg-status-critical-bg text-status-critical",
  bailed: "border-status-pending/25 bg-status-pending-bg text-status-pending",
};

export function PoliticianCard({ politician }: { politician: Politician }) {
  const custodyLabel = politician.custodyStatus ? CUSTODY_LABELS[politician.custodyStatus] : undefined;

  return (
    <li className="card-hover p-4">
      <Link to={`/politicians/${politician.id}/overview`} className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-ink-muted"
        >
          {initials(politician.fullName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-medium text-ink hover:text-accent">{politician.fullName}</p>
            {custodyLabel && (
              <span
                className={`chip shrink-0 py-0.5 text-[11px] ${CUSTODY_CLASSES[politician.custodyStatus as CustodyStatus]}`}
              >
                {custodyLabel}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-ink-muted">{politician.currentPosition || politician.profession || "—"}</p>
          <p className="truncate text-xs text-ink-faint">
            {politician.country}
            {politician.politicalParty ? ` · ${politician.politicalParty}` : ""}
          </p>
        </div>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2">
        <PublicationStatusBadge status={politician.publicationStatus} />
        <span className="text-xs text-ink-faint">
          {politician.lastResearchedAt ? `Researched ${formatDate(politician.lastResearchedAt)}` : "Not yet researched"}
        </span>
      </div>
    </li>
  );
}
