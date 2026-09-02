import { Link, useOutletContext } from "react-router-dom";
import { Plus } from "lucide-react";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianCases } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/lib/permissions/roles";
import { CaseCard } from "@/components/cases/CaseCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";

const CASE_TYPE_LABELS = { criminal: "Criminal", civil: "Civil" };

export function CasesTab({ caseType }: { caseType: "criminal" | "civil" }) {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { data: cases = [], isLoading } = usePoliticianCases(politician.id, userProfile?.role);
  const filtered = cases.filter((c) => c.caseType === caseType);
  const addCaseHref = `/cases/new?politicianId=${politician.id}`;

  if (isLoading) return <CardGridSkeleton count={3} />;

  if (filtered.length === 0) {
    return (
      <EmptyState
        title={`No ${caseType} cases found`}
        description={`We couldn't identify an active or historical ${caseType} proceeding from the sources currently available.`}
        action={
          can.createRecords(userProfile?.role) && (
            <Link to={addCaseHref} className="btn-secondary gap-1.5">
              <Plus size={16} aria-hidden="true" />
              Add a {CASE_TYPE_LABELS[caseType].toLowerCase()} case
            </Link>
          )
        }
      />
    );
  }

  return (
    <div>
      {can.createRecords(userProfile?.role) && (
        <div className="mb-4 flex justify-end">
          <Link to={addCaseHref} className="btn-secondary gap-1.5">
            <Plus size={16} aria-hidden="true" />
            Add case
          </Link>
        </div>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {filtered.map((c) => (
          <CaseCard key={c.id} legalCase={c} />
        ))}
      </ul>
    </div>
  );
}
