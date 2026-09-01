import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianEvents } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { Timeline } from "@/components/timelines/Timeline";

export function TimelineTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { data: events = [], isLoading } = usePoliticianEvents(politician.id, userProfile?.role);

  if (isLoading) return <p className="text-sm text-gray-500">Loading timeline...</p>;

  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold text-gray-900">Legal Timeline</h2>
      <div className="mt-4">
        <Timeline events={events} />
      </div>
    </div>
  );
}
