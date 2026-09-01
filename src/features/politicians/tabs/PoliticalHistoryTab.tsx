import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticalPositions } from "../api";
import { formatDate } from "@/lib/formatting/date";

export function PoliticalHistoryTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { data: positions = [], isLoading } = usePoliticalPositions(politician.id);
  const sorted = [...positions].sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""));

  if (isLoading) return <p className="text-sm text-slate-500 dark:text-slate-400">Loading political history...</p>;

  if (sorted.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No political positions have been recorded.</p>;
  }

  return (
    <ol className="space-y-3">
      {sorted.map((position) => (
        <li key={position.id} className="card p-4">
          <p className="font-medium text-slate-900 dark:text-white">{position.title}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {position.institution}
            {position.party ? ` · ${position.party}` : ""}
            {position.constituency ? ` · ${position.constituency}` : ""}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {position.startDate ? formatDate(position.startDate, "MMM yyyy") : "Start unknown"} —{" "}
            {position.endDate ? formatDate(position.endDate, "MMM yyyy") : "Present / unknown"}
          </p>
          {position.description && <p className="mt-2 text-sm text-slate-800 dark:text-slate-200">{position.description}</p>}
        </li>
      ))}
    </ol>
  );
}
