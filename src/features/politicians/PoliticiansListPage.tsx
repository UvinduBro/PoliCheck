import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { usePoliticians } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { PoliticianCard } from "@/components/politicians/PoliticianCard";
import { AddPoliticianButton } from "@/components/politicians/AddPoliticianButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function PoliticiansListPage() {
  const { userProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const { data: politicians = [], isLoading, error } = usePoliticians(userProfile?.role);

  const filtered = useMemo(() => {
    if (!search) return politicians;
    const needle = normalize(search);
    return politicians.filter((p) =>
      [p.fullName, ...p.alternativeNames, ...p.localLanguageNames, ...p.nicknames, p.country, p.politicalParty, p.constituency, p.currentPosition]
        .filter(Boolean)
        .some((value) => normalize(value as string).includes(needle)),
    );
  }, [politicians, search]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-page-heading font-semibold text-ink">Politician Profiles</h1>
          <p className="mt-1 text-sm text-ink-muted">Search verified profiles by name, party, constituency, or country.</p>
        </div>
        <AddPoliticianButton className="btn-primary shrink-0 gap-1.5" />
      </div>

      <div className="relative mt-5 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
        <label htmlFor="politician-search" className="sr-only">
          Search by name, party, constituency, or country
        </label>
        <input
          id="politician-search"
          className="input pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. Jane Doe, or Sri Lanka"
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : error ? (
          <ErrorState
            description="Politician profiles returned an error while loading. Try again shortly."
            detail={error instanceof Error ? error.message : undefined}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No profiles match your search"
            description="Try a different name, party, constituency, or country."
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PoliticianCard key={p.id} politician={p} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
