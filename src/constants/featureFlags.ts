/**
 * Optional, admin-toggleable app features. Kept OFF by default for initial launch, which is
 * scoped to politician profiles, legal cases, and allegations (claims) only — everything else
 * stays fully built and reachable in code, just hidden from navigation and routes until an
 * admin turns it back on from the Admin dashboard.
 */
export const FEATURE_FLAG_KEYS = [
  "investigations",
  "sources",
  "timeline",
  "politicalHistory",
  "biography",
  "reports",
] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[number];

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  investigations: false,
  sources: false,
  timeline: false,
  politicalHistory: false,
  biography: false,
  reports: false,
};

export const FEATURE_FLAG_LABELS: Record<FeatureFlagKey, string> = {
  investigations: "Investigations",
  sources: "Sources library",
  timeline: "Political & legal timeline",
  politicalHistory: "Political history (career positions)",
  biography: "Biography",
  reports: "Full report / dossier",
};

export const FEATURE_FLAG_DESCRIPTIONS: Record<FeatureFlagKey, string> = {
  investigations: "Agency investigations as a standalone record type, list page, and profile tab.",
  sources: "The Sources library (citation entities, verification, tiers) and its list/detail pages.",
  timeline: "The combined political & legal timeline tab and its category filters.",
  politicalHistory: "The career-positions tab on a politician's profile.",
  biography: "The biography tab and field on a politician's profile.",
  reports: "The auto-generated markdown dossier / full report page.",
};
