import type { CaseStage, ClaimClassification, FreedomStatus } from "@/types";

/** Canonical display label for every legal-status badge used across the app. Always paired with an icon/shape — never color alone (WCAG 1.4.1). */
export type StatusBadgeKey =
  | "VERIFIED"
  | "ALLEGATION"
  | "UNDER_INVESTIGATION"
  | "CASE_PENDING"
  | "CONVICTED"
  | "ACQUITTED"
  | "INCARCERATED"
  | "UNKNOWN";

/**
 * Semantic status color mapping (design spec §10): green = verified/clear, amber =
 * pending/investigation/unclear, red = conviction/incarceration, blue = informational,
 * gray = unknown. Backed by the Politician Watch status tokens so light/dark stay in sync from
 * one place — color is always paired with an icon + label, never used alone.
 */
export const STATUS_BADGE_CLASSES: Record<StatusBadgeKey, string> = {
  VERIFIED: "bg-status-verified-bg text-status-verified border-status-verified/25",
  ALLEGATION: "bg-status-pending-bg text-status-pending border-status-pending/25",
  UNDER_INVESTIGATION: "bg-status-info-bg text-status-info border-status-info/25",
  CASE_PENDING: "bg-status-info-bg text-status-info border-status-info/25",
  CONVICTED: "bg-status-critical-bg text-status-critical border-status-critical/25",
  ACQUITTED: "bg-status-verified-bg text-status-verified border-status-verified/25",
  INCARCERATED: "bg-status-critical-bg text-status-critical border-status-critical/25",
  UNKNOWN: "bg-status-neutral-bg text-status-neutral border-status-neutral/25",
};

export const CASE_STAGE_LABELS: Record<CaseStage, string> = {
  allegation_only: "Allegation Only",
  complaint: "Complaint Filed",
  investigation: "Under Investigation",
  arrest: "Arrested",
  remand: "Remanded",
  bail: "Released on Bail",
  indictment: "Indicted",
  trial: "Trial in Progress",
  convicted: "Convicted",
  acquitted: "Acquitted",
  dismissed: "Dismissed",
  withdrawn: "Withdrawn",
  settled: "Settled",
  appeal_pending: "Appeal Pending",
  appeal_successful: "Appeal Successful",
  appeal_unsuccessful: "Appeal Unsuccessful",
  completed: "Completed",
  unknown: "Unknown",
};

/** Case stages that represent an active, unresolved matter (used for dashboard "active cases" counts). */
export const ACTIVE_CASE_STAGES: CaseStage[] = [
  "allegation_only",
  "complaint",
  "investigation",
  "arrest",
  "remand",
  "bail",
  "indictment",
  "trial",
  "appeal_pending",
];

export const CLAIM_CLASSIFICATION_LABELS: Record<ClaimClassification, string> = {
  verified_fact: "VERIFIED FACT",
  court_finding: "COURT FINDING",
  conviction: "CONVICTION",
  acquittal: "ACQUITTAL",
  formal_allegation: "FORMAL ALLEGATION",
  ongoing_investigation: "ONGOING INVESTIGATION",
  media_report: "MEDIA REPORT",
  political_claim: "POLITICAL CLAIM",
  unverified_claim: "UNVERIFIED CLAIM",
};

export const FREEDOM_STATUS_LABELS: Record<FreedomStatus, string> = {
  free: "Free",
  incarcerated: "Incarcerated",
  detained: "Detained",
  on_bail: "Released on Bail",
  wanted: "Wanted / Warrant Active",
  travel_restricted: "Travel Restricted",
  unknown: "Unknown",
};

