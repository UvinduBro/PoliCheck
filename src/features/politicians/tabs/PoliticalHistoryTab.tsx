import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticalPositions } from "../api";
import { Timeline, type TimelineEntry } from "@/components/timelines/Timeline";
import { CardSkeleton } from "@/components/feedback/Skeleton";
import { formatDate } from "@/lib/formatting/date";

export function PoliticalHistoryTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { data: positions = [], isLoading } = usePoliticalPositions(politician.id);

  const entries = useMemo<TimelineEntry[]>(() => {
    const sorted = [...positions].sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""));
    return sorted.map((position) => ({
      id: position.id,
      date: position.startDate ?? "",
      category: "political" as const,
      eyebrow: position.startDate
        ? `${formatDate(position.startDate, "MMM yyyy")} — ${position.endDate ? formatDate(position.endDate, "MMM yyyy") : "Present"}`
        : "Date unknown",
      title: position.title,
      description: [position.institution, position.party, position.constituency].filter(Boolean).join(" · ") || undefined,
      note: position.description,
      current: !position.endDate,
    }));
  }, [positions]);

  if (isLoading) {
    return (
      <div className="card space-y-3 p-5">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold text-ink">Political Career</h2>
      <p className="mt-1 text-sm text-ink-muted">Elected and appointed positions held, in reverse chronological order.</p>
      <div className="mt-6">
        <Timeline entries={entries} emptyMessage="No political positions have been recorded." />
      </div>
    </div>
  );
}
