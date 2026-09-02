import { Building2, Clock, FileText, Landmark, Scale, Search, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommandSearch, type SearchResultItem } from "@/features/search/useCommandSearch";
import { addRecentSearch, getRecentSearches } from "@/lib/recentSearches";

interface FlatRow {
  key: string;
  group: string;
  icon: typeof User;
  title: string;
  subtitle: string;
  onSelect: () => void;
}

export function CommandSearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useCommandSearch(query, open);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setRecent(getRecentSearches());
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function go(item: SearchResultItem) {
    addRecentSearch(item.title);
    navigate(item.href);
    onClose();
  }

  function goToCourt(name: string) {
    addRecentSearch(name);
    navigate(`/cases?court=${encodeURIComponent(name)}`);
    onClose();
  }

  const rows: FlatRow[] = useMemo(() => {
    const list: FlatRow[] = [];
    results.politicians.forEach((p) =>
      list.push({ key: `p-${p.id}`, group: "Politicians", icon: User, title: p.title, subtitle: p.subtitle, onSelect: () => go(p) }),
    );
    results.cases.forEach((c) =>
      list.push({ key: `c-${c.id}`, group: "Legal Cases", icon: Scale, title: c.title, subtitle: c.subtitle, onSelect: () => go(c) }),
    );
    results.sources.forEach((s) =>
      list.push({ key: `s-${s.id}`, group: "Sources", icon: FileText, title: s.title, subtitle: s.subtitle, onSelect: () => go(s) }),
    );
    results.courts.forEach((court) =>
      list.push({
        key: `court-${court.name}`,
        group: "Courts",
        icon: Landmark,
        title: court.name,
        subtitle: `${court.caseCount} case${court.caseCount === 1 ? "" : "s"}`,
        onSelect: () => goToCourt(court.name),
      }),
    );
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(rows.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[activeIndex];
      if (row) row.onSelect();
    }
  }

  if (!open) return null;

  let groupCursor = "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="presentation">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in dark:bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Politician Watch"
        onKeyDown={onKeyDown}
        className="relative z-10 w-full max-w-xl animate-scale-in overflow-hidden rounded-lg border border-line bg-surface shadow-premium"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="shrink-0 text-ink-faint" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search politicians, cases, courts, sources…"
            aria-label="Search"
            autoComplete="off"
            className="min-h-[3.25rem] w-full bg-transparent py-3 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="hidden shrink-0 items-center justify-center rounded border border-line px-1.5 py-0.5 text-xs text-ink-faint sm:flex"
          >
            esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {query.trim() === "" && (
            <div className="px-2 py-1">
              {recent.length > 0 ? (
                <>
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">Recent searches</p>
                  <ul>
                    {recent.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => setQuery(term)}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-ink hover:bg-surface-2"
                        >
                          <Clock size={15} className="shrink-0 text-ink-faint" aria-hidden="true" />
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="px-3 py-6 text-center text-sm text-ink-muted">
                  Try a politician's name, a case number, a court, or a publisher.
                </p>
              )}
            </div>
          )}

          {query.trim() !== "" && results.isLoading && (
            <div className="space-y-2 px-2 py-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-md px-2 py-2">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-md bg-surface-2" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
                    <div className="h-2.5 w-1/4 animate-pulse rounded bg-surface-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {query.trim() !== "" && !results.isLoading && rows.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-ink">No matches for &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-sm text-ink-muted">Check the spelling, or try a broader term.</p>
            </div>
          )}

          {query.trim() !== "" &&
            !results.isLoading &&
            rows.map((row, index) => {
              const showGroupHeader = row.group !== groupCursor;
              groupCursor = row.group;
              const Icon = row.icon;
              return (
                <div key={row.key}>
                  {showGroupHeader && (
                    <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">{row.group}</p>
                  )}
                  <button
                    type="button"
                    onClick={row.onSelect}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      index === activeIndex ? "bg-surface-2" : "hover:bg-surface-2"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-2 text-ink-muted">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{row.title}</span>
                      <span className="block truncate text-xs text-ink-muted">{row.subtitle}</span>
                    </span>
                  </button>
                </div>
              );
            })}
        </div>

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-ink-faint sm:flex">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-line px-1.5 py-0.5">&uarr;&darr;</kbd> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-line px-1.5 py-0.5">&crarr;</kbd> select
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <Building2 size={13} aria-hidden="true" />
            Politician Watch
          </span>
        </div>
      </div>
    </div>
  );
}

