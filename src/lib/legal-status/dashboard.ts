import { isActiveCaseStage } from "./caseStage";
import { deriveFreedomStatus } from "./freedomStatus";
import type { FreedomStatusResult } from "./freedomStatus";
import type { Investigation, LegalCase, LegalEvent, LegalStatusDashboardData, Source } from "@/types";

export interface BuildDashboardInput {
  cases: LegalCase[];
  investigations: Investigation[];
  events: Pick<LegalEvent, "id" | "date" | "eventType" | "sourceIds">[];
  sources: Pick<Source, "id" | "tier" | "verificationStatus" | "publicationDate">[];
}

function countRisk(input: BuildDashboardInput, freedom: FreedomStatusResult): LegalStatusDashboardData["majorLegalRisk"] {
  const activeCriminal = input.cases.filter(
    (c) => c.caseType === "criminal" && isActiveCaseStage(c.legalStage),
  ).length;
  if (freedom.status === "incarcerated" || freedom.status === "wanted") return "high";
  if (activeCriminal > 0 || input.investigations.some((i) => i.currentStatus === "open")) return "medium";
  const hasConviction = input.cases.some((c) => c.legalStage === "convicted");
  if (hasConviction) return "medium";
  return "low";
}

/** Builds the client-side legal-status dashboard snapshot from published records only. */
export function buildLegalStatusDashboard(input: BuildDashboardInput): LegalStatusDashboardData {
  const freedom = deriveFreedomStatus(input.events, input.sources);

  const activeCriminalCases = input.cases.filter(
    (c) => c.caseType === "criminal" && isActiveCaseStage(c.legalStage),
  ).length;
  const activeCivilCases = input.cases.filter(
    (c) => c.caseType === "civil" && isActiveCaseStage(c.legalStage),
  ).length;
  const activeInvestigations = input.investigations.filter((i) => i.currentStatus === "open").length;
  const convictions = input.cases.filter((c) => c.legalStage === "convicted").length;
  const acquittals = input.cases.filter((c) => c.legalStage === "acquitted").length;
  const pendingAppeals = input.cases.filter((c) => c.legalStage === "appeal_pending").length;
  const activeWarrants = input.events.filter((e) => e.eventType === "warrant").length;
  const travelRestrictions = input.events.filter((e) => e.eventType === "travel_restriction").length;

  const dashboard: LegalStatusDashboardData = {
    freedomStatus: freedom.status,
    freedomStatusConfidence: freedom.confidence,
    activeCriminalCases,
    activeCivilCases,
    activeInvestigations,
    convictions,
    acquittals,
    pendingAppeals,
    activeWarrants,
    travelRestrictions,
    majorLegalRisk: "unknown",
    hasConflictingSources: freedom.hasConflict,
  };
  dashboard.majorLegalRisk = countRisk(input, freedom);
  return dashboard;
}
