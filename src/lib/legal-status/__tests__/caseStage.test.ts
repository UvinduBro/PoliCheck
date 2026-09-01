import { describe, expect, it } from "vitest";
import {
  isActiveCaseStage,
  isAllowedStageTransition,
  isClaimClassificationConsistentWithStage,
  isTerminalCaseStage,
} from "../caseStage";

describe("case stage helpers", () => {
  it("treats investigation/trial/bail as active, and acquitted/dismissed as not", () => {
    expect(isActiveCaseStage("investigation")).toBe(true);
    expect(isActiveCaseStage("trial")).toBe(true);
    expect(isActiveCaseStage("acquitted")).toBe(false);
    expect(isActiveCaseStage("dismissed")).toBe(false);
  });

  it("treats acquitted/dismissed/completed as terminal", () => {
    expect(isTerminalCaseStage("acquitted")).toBe(true);
    expect(isTerminalCaseStage("completed")).toBe(true);
    expect(isTerminalCaseStage("trial")).toBe(false);
  });

  it("allows a plausible progression from complaint to investigation", () => {
    expect(isAllowedStageTransition("complaint", "investigation")).toBe(true);
  });

  it("rejects jumping straight from allegation_only to convicted", () => {
    expect(isAllowedStageTransition("allegation_only", "convicted")).toBe(false);
  });

  it("always allows moving to unknown from any stage", () => {
    expect(isAllowedStageTransition("trial", "unknown")).toBe(true);
    expect(isAllowedStageTransition("convicted", "unknown")).toBe(true);
  });

  it("never treats an indictment as grounds for a conviction claim", () => {
    expect(isClaimClassificationConsistentWithStage("conviction", "indictment")).toBe(false);
    expect(isClaimClassificationConsistentWithStage("conviction", "convicted")).toBe(true);
  });

  it("never treats an investigation as grounds for an acquittal claim", () => {
    expect(isClaimClassificationConsistentWithStage("acquittal", "investigation")).toBe(false);
    expect(isClaimClassificationConsistentWithStage("acquittal", "acquitted")).toBe(true);
  });
});
