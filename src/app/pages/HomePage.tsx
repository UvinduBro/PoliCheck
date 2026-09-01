import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search as SearchIcon, ShieldCheck } from "lucide-react";
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
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">PoliCheck</h1>
        <p className="mx-auto mt-2 max-w-2xl text-gray-600">
          Structured, source-based research into politicians' identities, political histories, and legal
          status — court cases, investigations, convictions, acquittals, and current legal standing.
        </p>
        <form onSubmit={onSearchSubmit} className="mx-auto mt-6 flex max-w-lg items-center gap-2">
          <label htmlFor="home-search" className="sr-only">Search politicians</label>
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

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Allegations are not convictions.</p>
        <p className="mt-1">
          An indictment, complaint, or open investigation is never presented here as proof of guilt. Every
          significant claim is classified — verified fact, court finding, conviction, acquittal, formal
          allegation, ongoing investigation, media report, or political claim — and linked to its source.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Recently Updated Profiles</h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No profiles have been published yet.</p>
        ) : (
          <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => (
              <li key={p.id} className="card p-4">
                <Link to={`/politicians/${p.id}/overview`} className="font-medium text-blue-800 hover:underline">
                  {p.fullName}
                </Link>
                <p className="mt-1 text-sm text-gray-600">{p.country}</p>
                <div className="mt-2 flex items-center justify-between">
                  <PublicationStatusBadge status={p.publicationStatus} />
                  <span className="text-xs text-gray-400">{formatDate(p.updatedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900">
            <ShieldCheck size={18} className="text-blue-700" aria-hidden="true" /> Research Methodology
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Every profile follows a fixed workflow: identity verification, source collection, legal-record
            entry, timeline construction, independent reviewer approval, and only then publication. Draft and
            in-review material is never shown to the public.
          </p>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900">Source Quality</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {([1, 2, 3, 4] as const).map((tier) => (
              <li key={tier}>
                <span className="font-medium">{SOURCE_TIER_LABELS[tier]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            Tier 4 sources (blogs, anonymous sites, social media) are never used as sole evidence of guilt.
          </p>
        </div>
      </section>
    </div>
  );
}
