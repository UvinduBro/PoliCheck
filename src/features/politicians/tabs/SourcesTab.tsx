import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianCases, usePoliticianEvents, usePoliticianInvestigations, usePoliticianSources } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { SourceList } from "@/components/sources/SourceList";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";

export function SourcesTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { data: cases = [] } = usePoliticianCases(politician.id, userProfile?.role);
  const { data: investigations = [] } = usePoliticianInvestigations(politician.id, userProfile?.role);
  const { data: events = [] } = usePoliticianEvents(politician.id, userProfile?.role);

  const sourceIds = [
    ...cases.flatMap((c) => c.sourceIds),
    ...investigations.flatMap((i) => i.sourceIds),
    ...events.flatMap((e) => e.sourceIds),
  ];
  const { data: sources = [], isLoading } = usePoliticianSources(sourceIds);

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">Sources</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Every source cited across this profile's cases, investigations, and timeline events.
      </p>
      <div className="mt-4">
        {isLoading ? <CardGridSkeleton count={4} /> : <SourceList sources={sources} />}
      </div>
    </div>
  );
}
