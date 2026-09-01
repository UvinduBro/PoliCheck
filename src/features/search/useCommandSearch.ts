import { useMemo } from "react";
import { usePoliticians } from "@/features/politicians/api";
import { useAllCases } from "@/features/cases/api";
import { useSearchableSources } from "@/features/sources/api";
import { useAuth } from "@/hooks/useAuth";
import type { LegalCase, Politician, Source } from "@/types";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface CourtResultItem {
  name: string;
  caseCount: number;
}

export interface CommandSearchResults {
  politicians: SearchResultItem[];
  cases: SearchResultItem[];
  sources: SearchResultItem[];
  courts: CourtResultItem[];
  isLoading: boolean;
  totalCount: number;
}

const MAX_PER_GROUP = 5;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matches(needle: string, ...haystack: (string | undefined)[]): boolean {
  return haystack.some((value) => value && normalize(value).includes(needle));
}

/**
 * Client-side search across the politician/case/source lists this role can already read.
 * Firestore has no full-text search, so — same pattern as the existing politician list
 * search — this fetches the (role-scoped, cached) collection once and filters in memory.
 */
export function useCommandSearch(query: string, enabled: boolean): CommandSearchResults {
  const { userProfile } = useAuth();
  const role = userProfile?.role;

  const politiciansQuery = usePoliticians(role);
  const casesQuery = useAllCases(role);
  const sourcesQuery = useSearchableSources(role);

  const isLoading = enabled
    ? politiciansQuery.isLoading || casesQuery.isLoading || sourcesQuery.isLoading
    : false;

  const needle = normalize(query);

  return useMemo(() => {
    if (!enabled || !needle) {
      return { politicians: [], cases: [], sources: [], courts: [], isLoading, totalCount: 0 };
    }

    const politicianMatches = (politiciansQuery.data ?? []).filter((p: Politician) =>
      matches(needle, p.fullName, p.country, p.politicalParty, p.currentPosition, ...p.alternativeNames, ...p.nicknames),
    );
    const politicians: SearchResultItem[] = politicianMatches.slice(0, MAX_PER_GROUP).map((p) => ({
      id: p.id,
      title: p.fullName,
      subtitle: [p.currentPosition, p.country].filter(Boolean).join(" · ") || p.country,
      href: `/politicians/${p.id}/overview`,
    }));

    const caseMatches = (casesQuery.data ?? []).filter((c: LegalCase) =>
      matches(needle, c.caseName, c.caseNumber, c.court, c.jurisdiction),
    );
    const cases: SearchResultItem[] = caseMatches.slice(0, MAX_PER_GROUP).map((c) => ({
      id: c.id,
      title: c.caseName,
      subtitle: [c.caseNumber, c.court].filter(Boolean).join(" · ") || c.country,
      href: `/cases/${c.id}`,
    }));

    const sourceMatches = (sourcesQuery.data ?? []).filter((s: Source) => matches(needle, s.title, s.publisher));
    const sources: SearchResultItem[] = sourceMatches.slice(0, MAX_PER_GROUP).map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.publisher,
      href: `/sources/${s.id}`,
    }));

    const courtCounts = new Map<string, number>();
    for (const c of casesQuery.data ?? []) {
      if (c.court) courtCounts.set(c.court, (courtCounts.get(c.court) ?? 0) + 1);
    }
    const courts: CourtResultItem[] = Array.from(courtCounts.entries())
      .filter(([name]) => matches(needle, name))
      .slice(0, MAX_PER_GROUP)
      .map(([name, caseCount]) => ({ name, caseCount }));

    return {
      politicians,
      cases,
      sources,
      courts,
      isLoading,
      totalCount: politicians.length + cases.length + sources.length + courts.length,
    };
  }, [enabled, needle, politiciansQuery.data, casesQuery.data, sourcesQuery.data, isLoading]);
}
