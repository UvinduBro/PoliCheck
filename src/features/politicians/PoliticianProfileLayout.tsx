import { Outlet, useParams } from "react-router-dom";
import { usePolitician } from "./api";
import { PoliticianStatusActions } from "./PoliticianStatusActions";
import { ReportErrorButton } from "./ReportErrorButton";
import { ProfileTabs } from "@/components/navigation/ProfileTabs";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { formatDate } from "@/lib/formatting/date";
import type { Politician } from "@/types";

const TABS = [
  { path: "overview", label: "Executive Summary" },
  { path: "biography", label: "Biography" },
  { path: "political-history", label: "Political History" },
  { path: "legal-status", label: "Current Legal Status" },
  { path: "criminal-cases", label: "Criminal Cases" },
  { path: "civil-cases", label: "Civil Cases" },
  { path: "investigations", label: "Investigations" },
  { path: "timeline", label: "Legal Timeline" },
  { path: "sources", label: "Sources" },
  { path: "report", label: "Full Report" },
];

export interface PoliticianOutletContext {
  politician: Politician;
}

export function PoliticianProfileLayout() {
  const { politicianId } = useParams();
  const { data: politician, isLoading, error } = usePolitician(politicianId);

  if (isLoading) return <p className="text-sm text-gray-500">Loading profile...</p>;
  if (error || !politician) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        This profile could not be found, or is not published.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{politician.fullName}</h1>
          <p className="text-sm text-gray-600">
            {politician.currentPosition || politician.profession || "Position unknown"} · {politician.country}
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <PublicationStatusBadge status={politician.publicationStatus} />
          <p className="mt-1">
            Research cutoff: {politician.researchCutoff ? formatDate(politician.researchCutoff) : "Not set"}
          </p>
        </div>
      </div>

      <PoliticianStatusActions politician={politician} />

      <div className="mt-6">
        <ProfileTabs basePath={`/politicians/${politician.id}`} tabs={TABS} />
      </div>

      <div className="mt-6">
        <Outlet context={{ politician } satisfies PoliticianOutletContext} />
      </div>

      {politician.publicationStatus === "published" && (
        <div className="mt-10 border-t border-gray-200 pt-4">
          <ReportErrorButton politicianId={politician.id} />
        </div>
      )}
    </div>
  );
}
