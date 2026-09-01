import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianEvents } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { Timeline } from "@/components/timelines/Timeline";

export function TimelineTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { data: events = [], isLoading } = usePoliticianEvents(politician.id, userProfile?.role);

  if (isLoading) return <p className="text-sm text-slate-500 dark:text-slate-400">Loading timeline...</p>;

  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Legal Timeline</h2>
      <div className="mt-4">
        <Timeline events={events} />
      </div>
    </div>
  );
}
