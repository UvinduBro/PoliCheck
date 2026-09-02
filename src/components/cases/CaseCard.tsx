import { ArrowRight, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { CASE_STAGE_LABELS } from "@/constants/legalStatus";
import { isActiveCaseStage } from "@/lib/legal-status/caseStage";
import { formatDate } from "@/lib/formatting/date";
import type { LegalCase } from "@/types";

const STAGE_TONE: Record<string, string> = {
  convicted: "text-status-critical",
  acquitted: "text-status-verified",
  dismissed: "text-status-verified",
  appeal_successful: "text-status-verified",
  appeal_unsuccessful: "text-status-critical",
};

export function CaseCard({ legalCase }: { legalCase: LegalCase }) {
  const active = isActiveCaseStage(legalCase.legalStage);
  const stageTone = STAGE_TONE[legalCase.legalStage] ?? (active ? "text-status-pending" : "text-status-neutral");

  return (
    <li className="card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/cases/${legalCase.id}`} className="font-medium text-ink hover:text-accent">
            {legalCase.caseName}
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            <Landmark size={13} className="shrink-0" aria-hidden="true" />
            {legalCase.court || "Court unknown"}
            {legalCase.caseNumber && <span className="text-ink-faint">· {legalCase.caseNumber}</span>}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border border-line px-2.5 py-1 text-xs font-semibold ${stageTone}`}>
          {CASE_STAGE_LABELS[legalCase.legalStage]}
        </span>
      </div>

      {legalCase.latestDevelopment && (
        <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{legalCase.latestDevelopment}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-faint">
        <span>
          {(() => {
            const count = legalCase.sourceIds.length + (legalCase.sourceLinks?.length ?? 0);
            return `${count} source${count === 1 ? "" : "s"}`;
          })()}
          {legalCase.dateFiled && ` · Filed ${formatDate(legalCase.dateFiled)}`}
        </span>
        <Link to={`/cases/${legalCase.id}`} className="flex items-center gap-1 font-medium text-accent hover:underline">
          View case <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}
