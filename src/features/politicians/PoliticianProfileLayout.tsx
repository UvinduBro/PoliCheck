import { Outlet, useParams } from "react-router-dom";
import { usePolitician } from "./api";
import { PoliticianStatusActions } from "./PoliticianStatusActions";
import { ReportErrorButton } from "./ReportErrorButton";
import { ProfileTabs } from "@/components/navigation/ProfileTabs";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { VerificationIndicator } from "@/components/profile/VerificationIndicator";
import { ProfileHeaderSkeleton } from "@/components/feedback/Skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { formatDate } from "@/lib/formatting/date";
import type { Politician } from "@/types";

const TABS = [
  { path: "overview", label: "Overview" },
  { path: "biography", label: "Biography" },
  { path: "political-history", label: "Political History" },
  { path: "legal-status", label: "Legal Status" },
  { path: "criminal-cases", label: "Criminal Cases" },
  { path: "civil-cases", label: "Civil Cases" },
  { path: "investigations", label: "Investigations" },
  { path: "timeline", label: "Timeline" },
  { path: "sources", label: "Sources" },
  { path: "report", label: "Full Report" },
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
  const { politicianId } = useParams();
  const { data: politician, isLoading, error } = usePolitician(politicianId);

  if (isLoading) return <ProfileHeaderSkeleton />;
  if (error || !politician) {
    return (
      <ErrorState
        title="This profile could not be found"
        description="It may not exist, or it hasn't been published yet. Check the link, or search for the person you're looking for."
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
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-2 text-lg font-semibold text-ink-muted sm:h-20 sm:w-20 sm:text-xl">
              {initials(politician.fullName)}
            </span>
            <div>
              <h1 className="font-serif-report text-2xl font-semibold text-ink sm:text-page-heading">
                {politician.fullName}
              </h1>
              <p className="mt-1 text-sm text-ink-muted">{metaParts.join(" · ") || "Details not yet recorded"}</p>
              <div className="mt-2">
                <VerificationIndicator confidence={politician.identityConfidence} />
              </div>
            </div>
          </div>
          <div className="text-right">
            <PublicationStatusBadge status={politician.publicationStatus} />
            <p className="mt-1.5 text-xs text-ink-faint">
              Last researched:{" "}
              {politician.lastResearchedAt
                ? formatDate(politician.lastResearchedAt)
                : politician.researchCutoff
                  ? formatDate(politician.researchCutoff)
                  : "Not yet recorded"}
            </p>
          </div>
        </div>

        <PoliticianStatusActions politician={politician} />
      </div>

      <div className="mt-6">
        <ProfileTabs basePath={`/politicians/${politician.id}`} tabs={TABS} />
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
