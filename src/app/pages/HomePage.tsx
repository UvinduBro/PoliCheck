import { Link } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyUpdatedPoliticians } from "@/features/politicians/api";
import { useCommandSearchContext } from "@/features/search/CommandSearchContext";
import { PoliticianCard } from "@/components/politicians/PoliticianCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";
import { getRecentSearches } from "@/lib/recentSearches";

export function HomePage() {
  const { userProfile } = useAuth();
  const { data: recent = [], isLoading } = useRecentlyUpdatedPoliticians(userProfile?.role);
  const { openSearch } = useCommandSearchContext();
  const recentSearches = getRecentSearches();

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden px-2 pb-4 pt-10 text-center sm:pt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,theme(colors.accent.100),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,theme(colors.accent.950),transparent_65%)]"
        />
        <p className="eyebrow">Sri Lanka Public Record Intelligence</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-hero-mobile font-semibold text-ink sm:text-hero">
          Know the record behind the politician.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-ink-muted sm:text-lg">
          Research Sri Lankan political careers, court proceedings, investigations and public records —
          backed by sources you can verify.
        </p>

        <button
          type="button"
          onClick={openSearch}
          className="mx-auto mt-8 flex w-full max-w-xl items-center gap-3 rounded-lg border border-line bg-surface px-4 py-4 text-left shadow-soft transition-all hover:border-line-strong hover:shadow-elevated"
        >
          <SearchIcon size={18} className="shrink-0 text-ink-faint" aria-hidden="true" />
          <span className="flex-1 text-[15px] text-ink-faint">
            Search a politician… <span className="hidden sm:inline">try &ldquo;Ranil Wickremesinghe&rdquo;</span>
          </span>
          <kbd className="hidden shrink-0 rounded border border-line bg-surface-2 px-1.5 py-0.5 text-xs text-ink-faint sm:block">
            ⌘K
          </kbd>
        </button>

        {recentSearches.length > 0 && (
          <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-ink-faint">Recent:</span>
            {recentSearches.slice(0, 4).map((term) => (
              <button
                key={term}
                type="button"
                onClick={openSearch}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-section-heading font-semibold text-ink">Recently updated profiles</h2>
          <Link to="/politicians" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        {isLoading ? (
          <div className="mt-4">
            <CardGridSkeleton count={4} />
          </div>
        ) : recent.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No profiles have been published yet" />
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => (
              <PoliticianCard key={p.id} politician={p} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
