import { isActiveCaseStage } from "./caseStage";
import { deriveFreedomStatus } from "./freedomStatus";
import type { FreedomStatusResult } from "./freedomStatus";
import type { Investigation, LegalCase, LegalEvent, LegalStatusDashboardData, Politician, Source } from "@/types";

export interface BuildDashboardInput {
  /** When the politician's custodyStatus is explicitly set, it takes precedence over the
   *  LegalEvent-derived status below — the simplified, direct capture path for initial launch. */
  politician?: Pick<Politician, "custodyStatus" | "custodySince">;
  cases: LegalCase[];
  investigations: Investigation[];
  events: Pick<LegalEvent, "id" | "date" | "eventType" | "sourceIds">[];
  sources: Pick<Source, "id" | "tier" | "verificationStatus" | "publicationDate">[];
}

function resolveFreedomStatus(input: BuildDashboardInput): FreedomStatusResult {
  // Only "jailed"/"bailed" are treated as an authoritative override — "not_in_custody" is
  // also the form's default, so treating it as an override would permanently mask the
  // fuller LegalEvent-derived signal (still relevant if Timeline is re-enabled later) for
  // every profile, even ones nobody has actually confirmed are free.
  const custody = input.politician?.custodyStatus;
  if (custody === "jailed") {
    return { status: "incarcerated", confidence: "high", hasConflict: false, conflictingEventIds: [] };
  }
  if (custody === "bailed") {
    return { status: "on_bail", confidence: "high", hasConflict: false, conflictingEventIds: [] };
  }
  return deriveFreedomStatus(input.events, input.sources);
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
  const freedom = resolveFreedomStatus(input);

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
