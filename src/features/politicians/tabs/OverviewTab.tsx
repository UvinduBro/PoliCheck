import { Briefcase, Flag, Gavel, Landmark, MapPin, ScrollText, ShieldCheck, XCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { useLegalStatusDashboard, usePoliticalPositions } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { buildLegalStatusDashboard } from "@/lib/legal-status/dashboard";
import { LegalStatusCard } from "@/components/profile/LegalStatusCard";
import { InfoGrid, type InfoGridItem } from "@/components/profile/InfoGrid";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";

function careerLength(startDates: string[]): string {
  const years = startDates.map((d) => Number.parseInt(d.slice(0, 4), 10)).filter((y) => !Number.isNaN(y));
  if (years.length === 0) return "Not recorded";
  const span = new Date().getFullYear() - Math.min(...years);
  return span <= 0 ? "Less than a year" : `${span} year${span === 1 ? "" : "s"}`;
}

export function OverviewTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { cases, investigations, events, sources, isLoading } = useLegalStatusDashboard(politician.id, userProfile?.role);
  const { data: positions = [] } = usePoliticalPositions(politician.id);
  const dashboard = buildLegalStatusDashboard({ politician, cases, investigations, events, sources });

  const convictions = cases.filter((c) => c.legalStage === "convicted");
  const acquittals = cases.filter((c) => c.legalStage === "acquitted");
  const openInvestigations = investigations.filter((i) => i.currentStatus === "open");

  const infoItems: InfoGridItem[] = [
    { label: "Political position", value: politician.currentPosition || "Not established", icon: Briefcase },
    { label: "Political party", value: politician.politicalParty || "Not recorded", icon: Landmark },
    { label: "Constituency", value: politician.constituency || "Not recorded", icon: MapPin },
    { label: "Political career", value: careerLength(positions.map((p) => p.startDate).filter((d): d is string => Boolean(d))), icon: Flag },
    { label: "Active cases", value: String(dashboard.activeCriminalCases + dashboard.activeCivilCases), icon: ScrollText },
    { label: "Investigations", value: String(openInvestigations.length), icon: Gavel },
    { label: "Convictions", value: String(convictions.length), icon: XCircle },
    { label: "Acquittals", value: String(acquittals.length), icon: ShieldCheck },
  ];

  if (isLoading) {
    return <CardGridSkeleton count={2} />;
  }

  return (
    <div className="space-y-6">
      <LegalStatusCard
        status={dashboard.freedomStatus}
        confidence={dashboard.freedomStatusConfidence}
        lastVerified={politician.lastResearchedAt}
        hasConflict={dashboard.hasConflictingSources}
        evidenceHref={`/politicians/${politician.id}/legal-status`}
        custodySince={politician.custodySince}
        sentenceYears={politician.sentenceYears}
        custodySourceLink={politician.custodySourceLink}
      />

      <InfoGrid items={infoItems} />

      <section className="card p-6">
        <h2 className="text-section-heading font-semibold text-ink">Identity verification</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-ink-faint">Identity confidence</dt>
            <dd className="mt-1 text-sm capitalize text-ink">{politician.identityConfidence}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Alternative / local-language names</dt>
            <dd className="mt-1 text-sm text-ink">
              {[...politician.alternativeNames, ...politician.localLanguageNames].join(", ") || "None recorded"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Nationality</dt>
            <dd className="mt-1 text-sm text-ink">{politician.nationality || "Unknown"}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Date / place of birth</dt>
            <dd className="mt-1 text-sm text-ink">
              {politician.dateOfBirth || "Unknown"}
              {politician.placeOfBirth ? `, ${politician.placeOfBirth}` : ""}
            </dd>
          </div>
        </dl>
        {politician.identityConfidence === "unresolved" && (
          <p className="mt-4 rounded-md bg-status-pending-bg px-3 py-2.5 text-sm text-status-pending">
            Identity could not be conclusively confirmed. Records on this profile may describe more than one
            person sharing a similar name until this is resolved by a reviewer.
          </p>
        )}
      </section>

      <p className="text-xs text-ink-faint">
        Allegations are not convictions — see the Fact vs Allegation table in the Full Report tab.
      </p>
    </div>
  );
}
