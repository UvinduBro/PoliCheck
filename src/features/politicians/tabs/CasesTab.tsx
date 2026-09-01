import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianCases } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { CaseCard } from "@/components/cases/CaseCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";

export function CasesTab({ caseType }: { caseType: "criminal" | "civil" }) {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { data: cases = [], isLoading } = usePoliticianCases(politician.id, userProfile?.role);
  const filtered = cases.filter((c) => c.caseType === caseType);

  if (isLoading) return <CardGridSkeleton count={3} />;

  if (filtered.length === 0) {
    return (
      <EmptyState
        title={`No ${caseType} cases found`}
        description={`We couldn't identify an active or historical ${caseType} proceeding from the sources currently available.`}
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {filtered.map((c) => (
        <CaseCard key={c.id} legalCase={c} />
      ))}
    </ul>
  );
}
