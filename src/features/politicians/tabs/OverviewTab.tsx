import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { useLegalStatusDashboard } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { buildLegalStatusDashboard } from "@/lib/legal-status/dashboard";
import { FreedomStatusBadge } from "@/components/status/FreedomStatusBadge";
import { ConfidenceBadge } from "@/components/status/ConfidenceBadge";
import { FREEDOM_STATUS_LABELS } from "@/constants/legalStatus";
import { formatDate } from "@/lib/formatting/date";

export function OverviewTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { cases, investigations, events, sources, isLoading } = useLegalStatusDashboard(politician.id, userProfile?.role);
  const dashboard = buildLegalStatusDashboard({ cases, investigations, events, sources });

  const activeCases = cases.filter((c) => c.legalStage !== "acquitted" && c.legalStage !== "dismissed");
  const convictions = cases.filter((c) => c.legalStage === "convicted");
  const acquittals = cases.filter((c) => c.legalStage === "acquitted");

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900">Executive Summary</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Current Political Position</dt>
            <dd className="text-sm text-gray-900">{politician.currentPosition || "Not established"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Freedom Status</dt>
            <dd className="mt-1 flex items-center gap-2">
              <FreedomStatusBadge status={dashboard.freedomStatus} />
              <ConfidenceBadge level={dashboard.freedomStatusConfidence} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Active Court Cases / Investigations</dt>
            <dd className="text-sm text-gray-900">
              {activeCases.length} case(s), {investigations.filter((i) => i.currentStatus === "open").length} open investigation(s)
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Convictions / Acquittals</dt>
            <dd className="text-sm text-gray-900">{convictions.length} conviction(s), {acquittals.length} acquittal(s)</dd>
          </div>
        </dl>
        {!isLoading && dashboard.hasConflictingSources && (
          <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
            Sources disagree about this person's current freedom status. This has been marked unresolved
            pending reviewer confirmation — see the Legal Status and Timeline tabs for the conflicting events.
          </p>
        )}
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900">Identity Verification</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Identity Confidence</dt>
            <dd className="text-sm capitalize text-gray-900">{politician.identityConfidence}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Alternative / Local-Language Names</dt>
            <dd className="text-sm text-gray-900">
              {[...politician.alternativeNames, ...politician.localLanguageNames].join(", ") || "None recorded"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Nationality</dt>
            <dd className="text-sm text-gray-900">{politician.nationality || "Unknown"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Date / Place of Birth</dt>
            <dd className="text-sm text-gray-900">
              {politician.dateOfBirth || "Unknown"}{politician.placeOfBirth ? `, ${politician.placeOfBirth}` : ""}
            </dd>
          </div>
        </dl>
        {politician.identityConfidence === "unresolved" && (
          <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
            Identity could not be conclusively confirmed. Records on this profile may describe more than one
            person sharing a similar name until this is resolved by a reviewer.
          </p>
        )}
      </section>

      <p className="text-xs text-gray-500">
        Research cutoff: {politician.researchCutoff ? formatDate(politician.researchCutoff) : "Not set"}.
        Last researched: {politician.lastResearchedAt ? formatDate(politician.lastResearchedAt) : "Never"}.
        Allegations are not convictions — see the Fact vs Allegation table in the Full Report tab.
      </p>
    </div>
  );
}
