import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { useLegalStatusDashboard } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { buildLegalStatusDashboard } from "@/lib/legal-status/dashboard";
import { LegalStatusCard } from "@/components/profile/LegalStatusCard";
import { LegalStatusSummaryChart } from "@/components/charts/LegalStatusSummaryChart";
import { StatCard } from "@/components/data/StatCard";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";

const RISK_LABELS: Record<string, string> = { high: "High", medium: "Medium", low: "Low", unknown: "Unknown" };
const RISK_CLASSNAMES: Record<string, string> = {
  high: "text-status-critical",
  medium: "text-status-pending",
  low: "text-status-verified",
  unknown: "text-status-neutral",
};

export function LegalStatusTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { cases, investigations, events, sources, isLoading } = useLegalStatusDashboard(politician.id, userProfile?.role);
  const dashboard = buildLegalStatusDashboard({ politician, cases, investigations, events, sources });

  if (isLoading) return <CardGridSkeleton count={4} />;

  return (
    <div className="space-y-6">
      <LegalStatusCard
        status={dashboard.freedomStatus}
        confidence={dashboard.freedomStatusConfidence}
        lastVerified={politician.lastResearchedAt}
        hasConflict={dashboard.hasConflictingSources}
        evidenceHref={`/politicians/${politician.id}/criminal-cases`}
        custodySince={politician.custodySince}
        sentenceYears={politician.sentenceYears}
        custodySourceLink={politician.custodySourceLink}
      />

      <div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-section-heading font-semibold text-ink">At a glance</h2>
          <p className="text-sm text-ink-muted">
            Major legal risk:{" "}
            <span className={`font-medium ${RISK_CLASSNAMES[dashboard.majorLegalRisk]}`}>
              {RISK_LABELS[dashboard.majorLegalRisk]}
            </span>
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Active criminal cases" value={dashboard.activeCriminalCases} />
          <StatCard label="Active civil cases" value={dashboard.activeCivilCases} />
          <StatCard label="Active investigations" value={dashboard.activeInvestigations} />
          <StatCard label="Convictions" value={dashboard.convictions} />
          <StatCard label="Acquittals" value={dashboard.acquittals} />
          <StatCard label="Pending appeals" value={dashboard.pendingAppeals} />
          <StatCard label="Active warrants" value={dashboard.activeWarrants} />
          <StatCard label="Travel restrictions" value={dashboard.travelRestrictions} />
        </div>
      </div>

      <section className="card p-6">
        <h3 className="font-semibold text-ink">Cases &amp; investigations summary</h3>
        <div className="mt-3">
          <LegalStatusSummaryChart data={dashboard} />
        </div>
      </section>
    </div>
  );
}
