import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePoliticians } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { formatDate } from "@/lib/formatting/date";

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
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Politician Profiles</h1>
      <div className="mt-4">
        <label htmlFor="politician-search" className="label">Search by name, party, constituency, or country</label>
        <input
          id="politician-search"
          className="input max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. Jane Doe, or Sri Lanka"
        />
      </div>

      {isLoading && <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Loading profiles...</p>}
      {error && <p className="mt-6 text-sm text-red-700">Could not load politician profiles.</p>}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <li key={p.id} className="card p-4">
            <Link to={`/politicians/${p.id}/overview`} className="font-medium text-brand-700 hover:underline dark:text-brand-400">
              {p.fullName}
            </Link>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.currentPosition || p.profession || "—"}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{p.country}{p.politicalParty ? ` · ${p.politicalParty}` : ""}</p>
            <div className="mt-2 flex items-center justify-between">
              <PublicationStatusBadge status={p.publicationStatus} />
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {p.lastResearchedAt ? `Researched ${formatDate(p.lastResearchedAt)}` : "Not yet researched"}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {!isLoading && filtered.length === 0 && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">No profiles match your search.</p>
      )}
    </div>
  );
}
