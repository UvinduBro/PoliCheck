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
    <li className="card-hover p-5">
      <Link to={`/politicians/${politician.id}/overview`} className="flex flex-col items-center text-center">
        {politician.photoUrl ? (
          <img
            src={politician.photoUrl}
            alt=""
            className="h-20 w-20 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-surface-2 text-lg font-semibold text-ink-muted"
          >
            {initials(politician.fullName)}
          </span>
        )}
        <div className="mt-3 w-full min-w-0">
          <p className="truncate font-medium text-ink hover:text-accent">{politician.fullName}</p>
          <p className="mt-0.5 truncate text-sm text-ink-muted">{politician.currentPosition || politician.profession || "—"}</p>
          <p className="truncate text-xs text-ink-faint">
            {politician.country}
            {politician.politicalParty ? ` · ${politician.politicalParty}` : ""}
          </p>
          {custodyLabel && (
            <span
              className={`chip mt-2 py-0.5 text-[11px] ${CUSTODY_CLASSES[politician.custodyStatus as CustodyStatus]}`}
            >
              {custodyLabel}
            </span>
          )}
        </div>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
        <PublicationStatusBadge status={politician.publicationStatus} />
        <span className="text-xs text-ink-faint">
          {politician.lastResearchedAt ? `Researched ${formatDate(politician.lastResearchedAt)}` : "Not yet researched"}
        </span>
      </div>
    </li>
  );
}
