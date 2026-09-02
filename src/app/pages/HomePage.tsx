import { Link } from "react-router-dom";
import { BookOpenCheck, CheckCircle2, Clock, Search as SearchIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyUpdatedPoliticians } from "@/features/politicians/api";
import { useCommandSearchContext } from "@/features/search/CommandSearchContext";
import { StatusBadge } from "@/components/status/StatusBadge";
import { PoliticianCard } from "@/components/politicians/PoliticianCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";
import { SOURCE_TIER_LABELS } from "@/constants/sourceTiers";
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

      <section aria-label="Example research preview" className="mx-auto max-w-2xl">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line bg-surface-2/50 px-5 py-2.5">
            <span className="eyebrow">Example preview</span>
            <span className="flex items-center gap-1 text-xs text-ink-faint">
              <Clock size={12} aria-hidden="true" /> Updated 2 hours ago
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 px-5 py-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-2 text-lg font-semibold text-ink-muted">
              EP
            </span>
            <div className="min-w-[180px] flex-1">
              <p className="font-serif-report text-lg font-semibold text-ink">Example Politician</p>
              <p className="text-sm text-ink-muted">Active Parliamentarian</p>
            </div>
            <StatusBadge status="UNDER_INVESTIGATION" />
          </div>
          <dl className="grid grid-cols-1 divide-y divide-line border-t border-line sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            <div className="px-5 py-4">
              <dt className="text-xs text-ink-faint">Legal status</dt>
              <dd className="mt-1 text-sm font-medium text-ink">3 ongoing proceedings</dd>
            </div>
            <div className="px-5 py-4">
              <dt className="text-xs text-ink-faint">Sources</dt>
              <dd className="mt-1 flex items-center gap-1 text-sm font-medium text-ink">
                <CheckCircle2 size={14} className="text-status-verified" aria-hidden="true" />
                42 verified
              </dd>
            </div>
            <div className="px-5 py-4">
              <dt className="text-xs text-ink-faint">Confidence</dt>
              <dd className="mt-1 text-sm font-medium text-ink">High</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-3xl rounded-lg border border-status-pending/25 bg-status-pending-bg px-5 py-4 text-sm text-ink">
        <p className="font-semibold text-status-pending">Allegations are not convictions.</p>
        <p className="mt-1 text-ink-muted">
          An indictment, complaint, or open investigation is never presented here as proof of guilt. Every
          significant claim is classified — verified fact, court finding, conviction, acquittal, formal
          allegation, ongoing investigation, media report, or political claim — and linked to its source.
        </p>
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

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-semibold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-accent">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            Research methodology
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            Every profile follows a fixed workflow: identity verification, source collection, legal-record
            entry, timeline construction, independent reviewer approval, and only then publication. Draft and
            in-review material is never shown to the public.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-semibold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-accent">
              <BookOpenCheck size={18} aria-hidden="true" />
            </span>
            Source quality
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
            {([1, 2, 3, 4] as const).map((tier) => (
              <li key={tier} className="flex items-baseline gap-2">
                <span className="font-medium text-ink">Tier {tier}</span>
                <span>— {SOURCE_TIER_LABELS[tier].replace(/^Tier \d — /, "")}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-faint">
            Tier 4 sources (blogs, anonymous sites, social media) are never used as sole evidence of guilt.
          </p>
        </div>
      </section>
    </div>
  );
}
