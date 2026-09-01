import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpenCheck, Scale, Search as SearchIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyUpdatedPoliticians } from "@/features/politicians/api";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { formatDate } from "@/lib/formatting/date";
import { SOURCE_TIER_LABELS } from "@/constants/sourceTiers";

export function HomePage() {
  const { userProfile } = useAuth();
  const { data: recent = [] } = useRecentlyUpdatedPoliticians(userProfile?.role);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-16 text-center shadow-soft sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,theme(colors.brand.100),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,theme(colors.brand.950),transparent_60%)]"
        />
        <span className="chip mx-auto border-brand-200 bg-brand-50 font-medium text-brand-800 dark:border-brand-800 dark:bg-brand-500/10 dark:text-brand-300">
          <Scale size={14} aria-hidden="true" />
          Source-based political research
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          PoliCheck
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-slate-600 dark:text-slate-400">
          Structured, source-based research into politicians' identities, political histories, and legal
          status — court cases, investigations, convictions, acquittals, and current legal standing.
        </p>
        <form
          onSubmit={onSearchSubmit}
          className="mx-auto mt-8 flex max-w-lg flex-col items-stretch gap-2 sm:flex-row"
        >
          <label htmlFor="home-search" className="sr-only">
            Search politicians
          </label>
          <input
            id="home-search"
            className="input"
            placeholder="Search by name, party, or country"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0">
            <SearchIcon size={16} aria-hidden="true" /> Search
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-900/10 dark:text-amber-200">
        <p className="font-semibold">Allegations are not convictions.</p>
        <p className="mt-1">
          An indictment, complaint, or open investigation is never presented here as proof of guilt. Every
          significant claim is classified — verified fact, court finding, conviction, acquittal, formal
          allegation, ongoing investigation, media report, or political claim — and linked to its source.
        </p>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recently Updated Profiles</h2>
          <Link to="/politicians" className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No profiles have been published yet.</p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => (
              <li key={p.id} className="card-hover p-4">
                <Link to={`/politicians/${p.id}/overview`} className="font-medium text-brand-700 hover:underline dark:text-brand-400">
                  {p.fullName}
                </Link>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.country}</p>
                <div className="mt-3 flex items-center justify-between">
                  <PublicationStatusBadge status={p.publicationStatus} />
                  <span className="text-xs text-slate-400 dark:text-slate-400">{formatDate(p.updatedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            Research Methodology
          </h2>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            Every profile follows a fixed workflow: identity verification, source collection, legal-record
            entry, timeline construction, independent reviewer approval, and only then publication. Draft and
            in-review material is never shown to the public.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
              <BookOpenCheck size={18} aria-hidden="true" />
            </span>
            Source Quality
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
            {([1, 2, 3, 4] as const).map((tier) => (
              <li key={tier} className="flex items-baseline gap-2">
                <span className="font-medium text-slate-900 dark:text-white">Tier {tier}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  — {SOURCE_TIER_LABELS[tier].replace(/^Tier \d — /, "")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Tier 4 sources (blogs, anonymous sites, social media) are never used as sole evidence of guilt.
          </p>
        </div>
      </section>
    </div>
  );
}
