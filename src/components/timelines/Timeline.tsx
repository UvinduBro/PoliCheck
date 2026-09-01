import { formatDate } from "@/lib/formatting/date";
import type { LegalEvent } from "@/types";

const EVENT_TYPE_LABELS: Record<LegalEvent["eventType"], string> = {
  complaint: "Complaint Filed",
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
  other: "Other Event",
};

export function Timeline({ events }: { events: LegalEvent[] }) {
  const sorted = [...events].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  if (sorted.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No timeline events recorded.
      </p>
    );
  }

  return (
    <ol className="relative space-y-7 border-l-2 border-slate-200 pl-6 dark:border-slate-800">
      {sorted.map((event) => (
        <li key={event.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-600 ring-4 ring-white dark:border-slate-950 dark:bg-brand-400 dark:ring-slate-950"
          />
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-400">
            {formatDate(event.date)} &middot; {EVENT_TYPE_LABELS[event.eventType]}
          </p>
          <h3 className="mt-0.5 font-medium text-slate-900 dark:text-white">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{event.description}</p>
          {event.legalSignificance && (
            <p className="mt-1 text-sm italic text-slate-600 dark:text-slate-400">{event.legalSignificance}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
