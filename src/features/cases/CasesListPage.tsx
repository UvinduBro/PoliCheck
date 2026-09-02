import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { useAllCases } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/lib/permissions/roles";
import { CaseCard } from "@/components/cases/CaseCard";
import { FilterBar } from "@/components/data/FilterBar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";
import { isActiveCaseStage, isTerminalCaseStage } from "@/lib/legal-status/caseStage";
import type { CaseType } from "@/types";

type TypeFilter = "all" | CaseType;
type StatusFilter = "all" | "active" | "completed";

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "criminal", label: "Criminal" },
  { value: "civil", label: "Civil" },
  { value: "corruption", label: "Corruption" },
  { value: "constitutional", label: "Constitutional" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function CasesListPage() {
  const { userProfile } = useAuth();
  const { data: cases = [], isLoading, error } = useAllCases(userProfile?.role);
  const [searchParams, setSearchParams] = useSearchParams();
  const courtFilter = searchParams.get("court");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (courtFilter && c.court !== courtFilter) return false;
      if (typeFilter !== "all" && c.caseType !== typeFilter) return false;
      if (statusFilter === "active" && !isActiveCaseStage(c.legalStage)) return false;
      if (statusFilter === "completed" && !isTerminalCaseStage(c.legalStage)) return false;
      return true;
    });
  }, [cases, courtFilter, typeFilter, statusFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-page-heading font-semibold text-ink">Legal Cases</h1>
          <p className="mt-1 text-sm text-ink-muted">Criminal, civil, corruption, and constitutional proceedings on record.</p>
        </div>
        {can.createRecords(userProfile?.role) && (
          <Link to="/cases/new" className="btn-primary shrink-0 gap-1.5">
            <Plus size={16} aria-hidden="true" />
            Add case
          </Link>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <FilterBar label="Case type" options={TYPE_OPTIONS} value={typeFilter} onChange={setTypeFilter} />
        <FilterBar label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        {courtFilter && (
          <button
            type="button"
            onClick={() => setSearchParams((prev) => { prev.delete("court"); return prev; })}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent"
          >
            Court: {courtFilter}
            <X size={12} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : error ? (
          <ErrorState description="The available sources returned an error while loading cases. Try again shortly." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No cases match these filters"
            description="Try a broader case type or status, or clear the court filter."
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CaseCard key={c.id} legalCase={c} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
