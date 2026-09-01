import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { useLegalStatusDashboard } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { buildLegalStatusDashboard } from "@/lib/legal-status/dashboard";
import { FreedomStatusBadge } from "@/components/status/FreedomStatusBadge";
import { ConfidenceBadge } from "@/components/status/ConfidenceBadge";
import { LegalStatusSummaryChart } from "@/components/charts/LegalStatusSummaryChart";
import { formatDate } from "@/lib/formatting/date";

const RISK_LABELS: Record<string, string> = { high: "High", medium: "Medium", low: "Low", unknown: "Unknown" };

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 text-center">
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export function LegalStatusTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { cases, investigations, events, sources, isLoading } = useLegalStatusDashboard(politician.id, userProfile?.role);
  const dashboard = buildLegalStatusDashboard({ cases, investigations, events, sources });

  if (isLoading) return <p className="text-sm text-gray-500">Loading legal status...</p>;

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Current Legal Status Dashboard</h2>
          <div className="flex items-center gap-2">
            <FreedomStatusBadge status={dashboard.freedomStatus} />
            <ConfidenceBadge level={dashboard.freedomStatusConfidence} />
          </div>
        </div>

        {dashboard.freedomStatusConfidence === "unresolved" && (
          <p className="mt-3 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
            Current incarceration/freedom status could not be conclusively verified from authoritative
            sources, or conflicting sources require reviewer confirmation before a status can be shown.
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Active Criminal Cases" value={dashboard.activeCriminalCases} />
          <StatTile label="Active Civil Cases" value={dashboard.activeCivilCases} />
          <StatTile label="Active Investigations" value={dashboard.activeInvestigations} />
          <StatTile label="Convictions" value={dashboard.convictions} />
          <StatTile label="Acquittals" value={dashboard.acquittals} />
          <StatTile label="Pending Appeals" value={dashboard.pendingAppeals} />
          <StatTile label="Active Warrants" value={dashboard.activeWarrants} />
          <StatTile label="Travel Restrictions" value={dashboard.travelRestrictions} />
        </div>

        <p className="mt-4 text-sm text-gray-700">
          Major legal risk: <span className="font-medium">{RISK_LABELS[dashboard.majorLegalRisk]}</span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Last verified: {politician.lastResearchedAt ? formatDate(politician.lastResearchedAt) : "Not yet verified"}
        </p>
      </section>

      <section className="card p-5">
        <h3 className="font-semibold text-gray-900">Cases &amp; Investigations Summary</h3>
        <div className="mt-3">
          <LegalStatusSummaryChart data={dashboard} />
        </div>
      </section>
    </div>
  );
}
