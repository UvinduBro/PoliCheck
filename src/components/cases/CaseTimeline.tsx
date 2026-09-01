import { Citation } from "@/components/evidence/Citation";
import { SourceTierBadge } from "@/components/sources/SourceTierBadge";
import { formatDate } from "@/lib/formatting/date";
import type { LegalEvent, Source } from "@/types";

const EVENT_TYPE_LABELS: Record<LegalEvent["eventType"], string> = {
  complaint: "Complaint",
  investigation: "Investigation Opened",
  arrest: "Arrest",
  detention: "Detention",
  remand: "Remand",
  bail: "Bail",
  indictment: "Indictment",
  hearing: "Hearing",
  judgment: "Judgment",
  conviction: "Conviction",
  acquittal: "Acquittal",
  dismissal: "Dismissal",
  appeal: "Appeal",
  release: "Release",
  warrant: "Warrant Issued",
  travel_restriction: "Travel Restriction",
  other: "Development",
};

export function CaseTimeline({ events, sources }: { events: LegalEvent[]; sources: Source[] }) {
  const sorted = [...events].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  if (sorted.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line-strong px-5 py-8 text-center text-sm text-ink-muted">
        No timeline events have been recorded for this case yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-8 border-l-2 border-line pl-6">
      {sorted.map((event) => {
        const linkedSources = event.sourceIds.map((id) => sources.find((s) => s.id === id)).filter(Boolean) as Source[];
        const bestTier = linkedSources.length > 0 ? Math.min(...linkedSources.map((s) => s.tier)) : undefined;

        return (
          <li key={event.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-bg bg-accent ring-4 ring-bg"
            />
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {formatDate(event.date)} · {EVENT_TYPE_LABELS[event.eventType]}
              </p>
              {bestTier && <SourceTierBadge tier={bestTier as 1 | 2 | 3 | 4} />}
            </div>
            <h3 className="mt-1 font-medium text-ink">{event.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              {event.description}
              {linkedSources.map((source, i) => (
                <Citation key={source.id} index={i + 1} source={source} />
              ))}
            </p>
            {event.legalSignificance && <p className="mt-1.5 text-sm italic text-ink-faint">{event.legalSignificance}</p>}
          </li>
        );
      })}
    </ol>
  );
}
