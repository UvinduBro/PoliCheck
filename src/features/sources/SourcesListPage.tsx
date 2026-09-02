import { useMemo, useState } from "react";
import { useSearchableSources } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { SourceCard } from "@/components/sources/SourceCard";
import { FilterBar } from "@/components/data/FilterBar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";
import { TIER_1_SOURCE_TYPES } from "@/constants/sourceTiers";

type TierGroupFilter = "all" | "primary" | "journalism" | "secondary";

const OPTIONS: { value: TierGroupFilter; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "primary", label: "Primary" },
  { value: "journalism", label: "Journalism" },
  { value: "secondary", label: "Secondary" },
];

export function SourcesListPage() {
  const { userProfile } = useAuth();
  const { data: sources = [], isLoading, error } = useSearchableSources(userProfile?.role);
  const [filter, setFilter] = useState<TierGroupFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return sources.filter((s) => {
      if (filter === "primary" && !TIER_1_SOURCE_TYPES.includes(s.sourceType)) return false;
      if (filter === "journalism" && s.tier !== 2) return false;
      if (filter === "secondary" && s.tier !== 3) return false;
      if (query.trim() && !`${s.title} ${s.publisher}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [sources, filter, query]);

  return (
    <div>
      <h1 className="text-page-heading font-semibold text-ink">Sources</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Every court document, government record, and journalism source cited across Politician Watch, with its tier
        and verification status.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar label="Source type" options={OPTIONS} value={filter} onChange={setFilter} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by title or publisher"
          className="input max-w-xs"
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : error ? (
          <ErrorState description="The available sources returned an error while loading. Try again shortly." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No sources match this filter" />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SourceCard key={s.id} source={s} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
