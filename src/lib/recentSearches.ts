const STORAGE_KEY = "politician-watch-recent-searches";
const MAX_ENTRIES = 6;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return getRecentSearches();
  const next = [trimmed, ...getRecentSearches().filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(
    0,
    MAX_ENTRIES,
  );
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, quota) — recent searches just won't persist.
  }
  return next;
}
