import { useMemo, useState } from "react";
import { useAllInvestigations } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { InvestigationCard } from "@/components/cases/InvestigationCard";
import { FilterBar } from "@/components/data/FilterBar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";
import type { Investigation } from "@/types";

type StatusFilter = "all" | Investigation["currentStatus"];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "referred", label: "Referred" },
];

export function InvestigationsListPage() {
  const { userProfile } = useAuth();
  const { data: investigations = [], isLoading, error } = useAllInvestigations(userProfile?.role);
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(
    () => investigations.filter((i) => status === "all" || i.currentStatus === status),
    [investigations, status],
  );

  return (
    <div>
      <h1 className="text-page-heading font-semibold text-ink">Investigations</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Corruption, financial, police, tax, and election investigations under way or on record.
      </p>

      <div className="mt-5">
        <FilterBar label="Status" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : error ? (
          <ErrorState description="The available sources returned an error while loading investigations." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No investigations match this filter" />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((i) => (
              <InvestigationCard
                key={i.id}
                investigation={i}
                href={i.politicianIds[0] ? `/politicians/${i.politicianIds[0]}/investigations` : undefined}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
