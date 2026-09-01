export * from "./firestore";

/** Aggregated, derived legal-status snapshot for a politician (not persisted — computed client-side from published cases/investigations/events). */
export type FreedomStatus =
  | "free"
  | "incarcerated"
  | "detained"
  | "on_bail"
  | "wanted"
  | "travel_restricted"
  | "unknown";

export interface LegalStatusDashboardData {
  politicalStatus?: string;
  freedomStatus: FreedomStatus;
  freedomStatusConfidence: "high" | "medium" | "low" | "unresolved";
  activeCriminalCases: number;
  activeCivilCases: number;
  activeInvestigations: number;
  convictions: number;
  acquittals: number;
  pendingAppeals: number;
  activeWarrants: number;
  travelRestrictions: number;
  majorLegalRisk: "high" | "medium" | "low" | "unknown";
  lastVerifiedAt?: string;
  mostRecentAuthoritativeSourceId?: string;
  hasConflictingSources: boolean;
}
