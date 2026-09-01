import { TIER_1_SOURCE_TYPES } from "@/constants/sourceTiers";
import type { ClaimClassification, SourceTier, SourceType } from "@/types";

/**
 * Section 14/16: Tier 4 sources (blogs, anonymous sites, social media) must never
 * be used as sole evidence of criminal guilt — i.e. they cannot alone back a
 * CONVICTION, COURT FINDING, or FORMAL ALLEGATION claim.
 */
const CLASSIFICATIONS_REQUIRING_TIER_3_OR_BETTER: ClaimClassification[] = [
  "verified_fact",
  "court_finding",
  "conviction",
  "acquittal",
  "formal_allegation",
];

export function isSourceTierSufficientForClassification(
  tier: SourceTier,
  classification: ClaimClassification,
): boolean {
  if (CLASSIFICATIONS_REQUIRING_TIER_3_OR_BETTER.includes(classification)) {
    return tier <= 3;
  }
  return true;
}

/** A court judgment/order etc. is always Tier 1 regardless of who selects the tier — catches data-entry mistakes. */
export function suggestedTierForSourceType(sourceType: SourceType): SourceTier | undefined {
  return TIER_1_SOURCE_TYPES.includes(sourceType) ? 1 : undefined;
}

export function isTierConsistentWithSourceType(
  tier: SourceTier,
  sourceType: SourceType,
): boolean {
  const suggested = suggestedTierForSourceType(sourceType);
  return suggested === undefined || tier === suggested;
}
