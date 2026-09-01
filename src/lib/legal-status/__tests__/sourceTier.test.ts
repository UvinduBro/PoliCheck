import { describe, expect, it } from "vitest";
import {
  isSourceTierSufficientForClassification,
  isTierConsistentWithSourceType,
  suggestedTierForSourceType,
} from "../sourceTier";

describe("source tier rules", () => {
  it("rejects a tier-4 source as sole backing for a conviction claim", () => {
    expect(isSourceTierSufficientForClassification(4, "conviction")).toBe(false);
    expect(isSourceTierSufficientForClassification(1, "conviction")).toBe(true);
  });

  it("rejects a tier-4 source for a formal allegation but allows it for a media report", () => {
    expect(isSourceTierSufficientForClassification(4, "formal_allegation")).toBe(false);
    expect(isSourceTierSufficientForClassification(4, "media_report")).toBe(true);
  });

  it("suggests tier 1 for a court judgment and none for a news article", () => {
    expect(suggestedTierForSourceType("court_judgment")).toBe(1);
    expect(suggestedTierForSourceType("news_article")).toBeUndefined();
  });

  it("flags a court order tagged as tier 3 as inconsistent", () => {
    expect(isTierConsistentWithSourceType(3, "court_order")).toBe(false);
    expect(isTierConsistentWithSourceType(1, "court_order")).toBe(true);
  });
});
