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
    return <p className="text-sm text-gray-500">No timeline events recorded.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l border-gray-200 pl-6">
      {sorted.map((event) => (
        <li key={event.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-700"
          />
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {formatDate(event.date)} &middot; {EVENT_TYPE_LABELS[event.eventType]}
          </p>
          <h3 className="mt-0.5 font-medium text-gray-900">{event.title}</h3>
          <p className="mt-1 text-sm text-gray-700">{event.description}</p>
          {event.legalSignificance && (
            <p className="mt-1 text-sm italic text-gray-600">{event.legalSignificance}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
