import { Briefcase, Flag, Gavel, Landmark, MapPin, ScrollText, ShieldCheck, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { useLegalStatusDashboard, usePoliticalPositions } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { buildLegalStatusDashboard } from "@/lib/legal-status/dashboard";
import { LegalStatusCard } from "@/components/profile/LegalStatusCard";
import { InfoGrid, type InfoGridItem } from "@/components/profile/InfoGrid";
import { CardGridSkeleton } from "@/components/feedback/Skeleton";

export function OverviewTab() {
  const { t } = useTranslation();
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { cases, investigations, events, sources, isLoading } = useLegalStatusDashboard(politician.id, userProfile?.role);
  const { data: positions = [] } = usePoliticalPositions(politician.id);
  const dashboard = buildLegalStatusDashboard({ politician, cases, investigations, events, sources });

  function careerLength(startDates: string[]): string {
    const years = startDates.map((d) => Number.parseInt(d.slice(0, 4), 10)).filter((y) => !Number.isNaN(y));
    if (years.length === 0) return t("overview.careerNotRecorded");
    const span = new Date().getFullYear() - Math.min(...years);
    return span <= 0 ? t("overview.careerLessThanYear") : t("overview.careerYears", { count: span });
  }

  const convictions = cases.filter((c) => c.legalStage === "convicted");
  const acquittals = cases.filter((c) => c.legalStage === "acquitted");
  const openInvestigations = investigations.filter((i) => i.currentStatus === "open");

  const infoItems: InfoGridItem[] = [
    { label: t("overview.positionLabel"), value: politician.currentPosition || t("overview.positionNotEstablished"), icon: Briefcase },
    { label: t("overview.partyLabel"), value: politician.politicalParty || t("overview.notRecorded"), icon: Landmark },
    { label: t("overview.constituencyLabel"), value: politician.constituency || t("overview.notRecorded"), icon: MapPin },
    { label: t("overview.careerLabel"), value: careerLength(positions.map((p) => p.startDate).filter((d): d is string => Boolean(d))), icon: Flag },
    { label: t("overview.activeCasesLabel"), value: String(dashboard.activeCriminalCases + dashboard.activeCivilCases), icon: ScrollText },
    { label: t("overview.investigationsLabel"), value: String(openInvestigations.length), icon: Gavel },
    { label: t("overview.convictionsLabel"), value: String(convictions.length), icon: XCircle },
    { label: t("overview.acquittalsLabel"), value: String(acquittals.length), icon: ShieldCheck },
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
        <h2 className="text-section-heading font-semibold text-ink">{t("overview.identityVerificationHeading")}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-ink-faint">{t("overview.identityConfidenceLabel")}</dt>
            <dd className="mt-1 text-sm capitalize text-ink">{politician.identityConfidence}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">{t("overview.alternativeNamesLabel")}</dt>
            <dd className="mt-1 text-sm text-ink">
              {[...politician.alternativeNames, ...politician.localLanguageNames].join(", ") || t("overview.noneRecorded")}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">{t("overview.nationalityLabel")}</dt>
            <dd className="mt-1 text-sm text-ink">{politician.nationality || t("overview.unknown")}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">{t("overview.birthLabel")}</dt>
            <dd className="mt-1 text-sm text-ink">
              {politician.dateOfBirth || t("overview.unknown")}
              {politician.placeOfBirth ? `, ${politician.placeOfBirth}` : ""}
            </dd>
          </div>
        </dl>
        {politician.identityConfidence === "unresolved" && (
          <p className="mt-4 rounded-md bg-status-pending-bg px-3 py-2.5 text-sm text-status-pending">
            {t("overview.identityUnresolvedWarning")}
          </p>
        )}
      </section>

      <p className="text-xs text-ink-faint">{t("overview.allegationsNote")}</p>
    </div>
  );
}
