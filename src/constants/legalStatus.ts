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

export const STATUS_BADGE_LABELS: Record<StatusBadgeKey, string> = {
  VERIFIED: "VERIFIED",
  ALLEGATION: "ALLEGATION / CLAIM",
  UNDER_INVESTIGATION: "UNDER INVESTIGATION",
  CASE_PENDING: "CASE PENDING",
  CONVICTED: "CONVICTED",
  ACQUITTED: "ACQUITTED / CASE DISMISSED",
  INCARCERATED: "INCARCERATED / DETAINED",
  UNKNOWN: "UNKNOWN",
};

export const STATUS_BADGE_CLASSES: Record<StatusBadgeKey, string> = {
  VERIFIED: "bg-green-100 text-green-900 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  ALLEGATION: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  UNDER_INVESTIGATION: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  CASE_PENDING: "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  CONVICTED: "bg-red-100 text-red-900 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  ACQUITTED: "bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
  INCARCERATED: "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  UNKNOWN: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
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
