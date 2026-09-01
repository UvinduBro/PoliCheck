import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianInvestigations } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { InvestigationCard } from "@/components/cases/InvestigationCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";

export function InvestigationsTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { data: investigations = [], isLoading } = usePoliticianInvestigations(politician.id, userProfile?.role);

  if (isLoading) return <CardGridSkeleton count={3} />;

  if (investigations.length === 0) {
    return (
      <EmptyState
        title="No investigations found"
        description="We couldn't identify an investigation involving this person from the sources currently available."
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {investigations.map((i) => (
        <InvestigationCard key={i.id} investigation={i} />
      ))}
    </ul>
  );
}
