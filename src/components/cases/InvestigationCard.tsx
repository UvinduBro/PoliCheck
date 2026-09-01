import { ArrowRight, Landmark } from "lucide-react";
import { formatDate } from "@/lib/formatting/date";
import type { Investigation } from "@/types";

const STATUS_TONE: Record<Investigation["currentStatus"], string> = {
  open: "text-status-pending",
  closed: "text-status-verified",
  referred: "text-status-info",
  unknown: "text-status-neutral",
};

const STATUS_LABELS: Record<Investigation["currentStatus"], string> = {
  open: "Open",
  closed: "Closed",
  referred: "Referred",
  unknown: "Unknown",
};

const TYPE_LABELS: Record<Investigation["investigationType"], string> = {
  corruption: "Corruption",
  financial: "Financial",
  police: "Police",
  tax: "Tax",
  election: "Election",
  other: "Other",
};

export function InvestigationCard({ investigation, href }: { investigation: Investigation; href?: string }) {
  return (
    <li className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-medium text-ink">
            <Landmark size={14} className="shrink-0 text-ink-faint" aria-hidden="true" />
            {investigation.agency}
          </p>
          <p className="mt-1 text-sm text-ink-muted">{TYPE_LABELS[investigation.investigationType]} investigation</p>
        </div>
        <span className={`shrink-0 rounded-full border border-line px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[investigation.currentStatus]}`}>
          {STATUS_LABELS[investigation.currentStatus]}
        </span>
      </div>
      {(investigation.latestDevelopment || investigation.description) && (
        <p className="mt-3 line-clamp-2 text-sm text-ink-muted">
          {investigation.latestDevelopment || investigation.description}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-faint">
        <span>
          {investigation.sourceIds.length} source{investigation.sourceIds.length === 1 ? "" : "s"}
          {investigation.startDate && ` · Started ${formatDate(investigation.startDate)}`}
        </span>
        {href && (
          <a href={href} className="flex items-center gap-1 font-medium text-accent hover:underline">
            View politician <ArrowRight size={12} aria-hidden="true" />
          </a>
        )}
      </div>
    </li>
  );
}
