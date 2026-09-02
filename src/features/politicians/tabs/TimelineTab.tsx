import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianEvents, usePoliticianCases, usePoliticianInvestigations, usePoliticalPositions } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { Timeline, type TimelineCategory, type TimelineEntry } from "@/components/timelines/Timeline";
import { FilterBar, type FilterOption } from "@/components/data/FilterBar";
import { Skeleton } from "@/components/feedback/Skeleton";
import { formatDate } from "@/lib/formatting/date";

const LEGAL_EVENT_LABELS: Record<string, string> = {
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

type CategoryFilter = "all" | TimelineCategory;

const OPTIONS: FilterOption<CategoryFilter>[] = [
  { value: "all", label: "All events" },
  { value: "political", label: "Political" },
  { value: "legal", label: "Legal events" },
  { value: "case", label: "Cases" },
  { value: "investigation", label: "Investigations" },
];

export function TimelineTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const role = userProfile?.role;

  const { data: events = [], isLoading: eventsLoading } = usePoliticianEvents(politician.id, role);
  const { data: cases = [], isLoading: casesLoading } = usePoliticianCases(politician.id, role);
  const { data: investigations = [], isLoading: investigationsLoading } = usePoliticianInvestigations(politician.id, role);
  const { data: positions = [], isLoading: positionsLoading } = usePoliticalPositions(politician.id);

  const [filter, setFilter] = useState<CategoryFilter>("all");

  const isLoading = eventsLoading || casesLoading || investigationsLoading || positionsLoading;

  const entries = useMemo<TimelineEntry[]>(() => {
    const all: TimelineEntry[] = [];

    for (const position of positions) {
      if (!position.startDate) continue;
      all.push({
        id: `position-${position.id}`,
        date: position.startDate,
        category: "political",
        eyebrow: `${formatDate(position.startDate, "MMM yyyy")} · Political`,
        title: position.title,
        description: [position.institution, position.party, position.constituency].filter(Boolean).join(" · ") || undefined,
        note: position.description,
        current: !position.endDate,
      });
    }

    for (const event of events) {
      all.push({
        id: `event-${event.id}`,
        date: event.date,
        category: "legal",
        eyebrow: `${formatDate(event.date)} · ${LEGAL_EVENT_LABELS[event.eventType] ?? "Legal Event"}`,
        title: event.title,
        description: event.description,
        note: event.legalSignificance,
      });
    }

    for (const legalCase of cases) {
      if (!legalCase.dateFiled) continue;
      all.push({
        id: `case-${legalCase.id}`,
        date: legalCase.dateFiled,
        category: "case",
        eyebrow: `${formatDate(legalCase.dateFiled)} · Case Filed`,
        title: legalCase.caseName,
        description: legalCase.allegations,
      });
    }

    for (const investigation of investigations) {
      if (!investigation.startDate) continue;
      all.push({
        id: `investigation-${investigation.id}`,
        date: investigation.startDate,
        category: "investigation",
        eyebrow: `${formatDate(investigation.startDate)} · Investigation Opened`,
        title: `${investigation.agency}${investigation.subject ? `: ${investigation.subject}` : ""}`,
        description: investigation.description,
        current: investigation.currentStatus === "open",
      });
    }

    return all.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  }, [positions, events, cases, investigations]);

  const filtered = filter === "all" ? entries : entries.filter((e) => e.category === filter);

  const counts = useMemo(() => {
    const c: Record<CategoryFilter, number> = { all: entries.length, political: 0, legal: 0, case: 0, investigation: 0 };
    for (const e of entries) c[e.category]++;
    return c;
  }, [entries]);

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">Political &amp; Legal Timeline</h2>
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        A chronological record combining political positions, legal proceedings, and investigations.
      </p>

      <div className="mt-4">
        <FilterBar
          label="Filter timeline"
          options={OPTIONS.map((o) => ({ ...o, count: counts[o.value] }))}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <Timeline entries={filtered} emptyMessage="No timeline events recorded for this filter." />
        )}
      </div>
    </div>
  );
}
