import { Link } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useRecentlyUpdatedPoliticians } from "@/features/politicians/api";
import { useCommandSearchContext } from "@/features/search/CommandSearchContext";
import { PoliticianCard } from "@/components/politicians/PoliticianCard";
import { AddPoliticianButton } from "@/components/politicians/AddPoliticianButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";
import { getRecentSearches } from "@/lib/recentSearches";

export function HomePage() {
  const { t } = useTranslation();
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
        <p className="eyebrow">{t("home.eyebrow")}</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-hero-mobile font-semibold text-ink sm:text-hero">
          {t("home.heroTitle")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-ink-muted sm:text-lg">
          {t("home.heroSubtitle")}
        </p>

        <button
          type="button"
          onClick={openSearch}
          className="mx-auto mt-8 flex w-full max-w-xl items-center gap-3 rounded-lg border border-line bg-surface px-4 py-4 text-left shadow-soft transition-all hover:border-line-strong hover:shadow-elevated"
        >
          <SearchIcon size={18} className="shrink-0 text-ink-faint" aria-hidden="true" />
          <span className="flex-1 text-[15px] text-ink-faint">
            {t("home.searchPlaceholder")} <span className="hidden sm:inline">{t("home.searchExample")}</span>
          </span>
          <kbd className="hidden shrink-0 rounded border border-line bg-surface-2 px-1.5 py-0.5 text-xs text-ink-faint sm:block">
            ⌘K
          </kbd>
        </button>

        {recentSearches.length > 0 && (
          <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-ink-faint">{t("home.recentLabel")}</span>
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

        <div className="mt-6 flex justify-center">
          <AddPoliticianButton className="btn-secondary gap-1.5" />
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-section-heading font-semibold text-ink">{t("home.recentlyUpdated")}</h2>
          <Link to="/politicians" className="text-sm font-medium text-accent hover:underline">
            {t("home.viewAll")}
          </Link>
        </div>
        {isLoading ? (
          <div className="mt-4">
            <CardGridSkeleton count={4} />
          </div>
        ) : recent.length === 0 ? (
          <div className="mt-4">
            <EmptyState title={t("home.noProfilesYet")} />
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
