import { Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePolitician } from "./api";
import { PoliticianStatusActions } from "./PoliticianStatusActions";
import { ReportErrorButton } from "./ReportErrorButton";
import { ProfileTabs } from "@/components/navigation/ProfileTabs";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { VerificationIndicator } from "@/components/profile/VerificationIndicator";
import { CustodyStatusCard } from "@/components/profile/CustodyStatusCard";
import { ProfileHeaderSkeleton } from "@/components/feedback/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { formatDate } from "@/lib/formatting/date";
import { useFeatureFlags } from "@/features/settings/api";
import type { FeatureFlagKey } from "@/constants/featureFlags";
import type { Politician } from "@/types";

const TAB_DEFS: { path: string; labelKey: string; flag?: FeatureFlagKey }[] = [
  { path: "overview", labelKey: "profile.tabs.overview" },
  { path: "biography", labelKey: "profile.tabs.biography", flag: "biography" },
  { path: "political-history", labelKey: "profile.tabs.politicalHistory", flag: "politicalHistory" },
  { path: "legal-status", labelKey: "profile.tabs.legalStatus" },
  { path: "criminal-cases", labelKey: "profile.tabs.criminalCases" },
  { path: "civil-cases", labelKey: "profile.tabs.civilCases" },
  { path: "investigations", labelKey: "profile.tabs.investigations", flag: "investigations" },
  { path: "timeline", labelKey: "profile.tabs.timeline", flag: "timeline" },
  { path: "sources", labelKey: "profile.tabs.sources", flag: "sources" },
  { path: "report", labelKey: "profile.tabs.report", flag: "reports" },
];

export interface PoliticianOutletContext {
  politician: Politician;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function PoliticianProfileLayout() {
  const { t } = useTranslation();
  const { politicianId } = useParams();
  const { data: politician, isLoading, error } = usePolitician(politicianId);
  const { flags } = useFeatureFlags();
  const tabs = TAB_DEFS.filter((tab) => !tab.flag || flags[tab.flag]).map((tab) => ({
    path: tab.path,
    label: t(tab.labelKey),
  }));

  if (isLoading) return <ProfileHeaderSkeleton />;
  if (error || !politician) {
    return (
      <ErrorState
        title={t("profile.notFoundTitle")}
        description={t("profile.notFoundDescription")}
      />
    );
  }

  const metaParts = [politician.politicalParty, politician.currentPosition, politician.country, politician.constituency].filter(
    Boolean,
  );

  return (
    <div>
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {politician.photoUrl ? (
              <img
                src={politician.photoUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-20 sm:w-20"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-2 text-lg font-semibold text-ink-muted sm:h-20 sm:w-20 sm:text-xl">
                {initials(politician.fullName)}
              </span>
            )}
            <div>
              <h1 className="font-serif-report text-2xl font-semibold text-ink sm:text-page-heading">
                {politician.fullName}
              </h1>
              <p className="mt-1 text-sm text-ink-muted">{metaParts.join(" · ") || t("profile.detailsNotYetRecorded")}</p>
              <div className="mt-2">
                <VerificationIndicator confidence={politician.identityConfidence} />
              </div>
            </div>
          </div>
          <div className="text-right">
            <PublicationStatusBadge status={politician.publicationStatus} />
            <p className="mt-1.5 text-xs text-ink-faint">
              {t("profile.lastResearched")}{" "}
              {politician.lastResearchedAt
                ? formatDate(politician.lastResearchedAt)
                : politician.researchCutoff
                  ? formatDate(politician.researchCutoff)
                  : t("profile.notYetRecorded")}
            </p>
          </div>
        </div>

        <PoliticianStatusActions politician={politician} />
      </div>

      <CustodyStatusCard politician={politician} />

      <div className="mt-6">
        <ProfileTabs basePath={`/politicians/${politician.id}`} tabs={tabs} />
      </div>

      <div className="mt-6">
        <Outlet context={{ politician } satisfies PoliticianOutletContext} />
      </div>

      {politician.publicationStatus === "published" && (
        <div className="mt-10 border-t border-line pt-4">
          <ReportErrorButton politicianId={politician.id} />
        </div>
      )}
    </div>
  );
}
