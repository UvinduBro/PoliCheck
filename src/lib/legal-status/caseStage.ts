import { ACTIVE_CASE_STAGES } from "@/constants/legalStatus";
import type { CaseStage, ClaimClassification } from "@/types";

export function isActiveCaseStage(stage: CaseStage): boolean {
  return ACTIVE_CASE_STAGES.includes(stage);
}

const TERMINAL_STAGES: CaseStage[] = [
  "acquitted",
  "dismissed",
  "withdrawn",
  "settled",
  "appeal_successful",
  "appeal_unsuccessful",
  "completed",
];

export function isTerminalCaseStage(stage: CaseStage): boolean {
  return TERMINAL_STAGES.includes(stage);
}

/**
 * Legal stages that a case may move to from its current stage. This is advisory
 * (surfaced in the UI to catch data-entry mistakes such as jumping straight from
 * "complaint" to "convicted") rather than a hard constraint, since real-world
 * proceedings sometimes skip stages or reopen. "unknown" can always be reached
 * (a case can always regress to "we're not sure"), and any stage can move to
 * "appeal_pending" once a first-instance outcome exists.
 */
const ALLOWED_NEXT_STAGES: Record<CaseStage, CaseStage[]> = {
  allegation_only: ["complaint", "investigation", "withdrawn", "unknown"],
  complaint: ["investigation", "arrest", "indictment", "withdrawn", "dismissed", "unknown"],
  investigation: ["arrest", "indictment", "dismissed", "withdrawn", "unknown"],
  arrest: ["remand", "bail", "indictment", "dismissed", "unknown"],
  remand: ["bail", "indictment", "trial", "unknown"],
  bail: ["indictment", "trial", "dismissed", "withdrawn", "unknown"],
  indictment: ["trial", "dismissed", "withdrawn", "settled", "unknown"],
  trial: ["convicted", "acquitted", "dismissed", "settled", "unknown"],
  convicted: ["appeal_pending", "completed", "unknown"],
  acquitted: ["appeal_pending", "unknown"],
  dismissed: ["appeal_pending", "unknown"],
  withdrawn: ["unknown"],
  settled: ["unknown"],
  appeal_pending: ["appeal_successful", "appeal_unsuccessful", "unknown"],
  appeal_successful: ["unknown"],
  appeal_unsuccessful: ["completed", "unknown"],
  completed: ["unknown"],
  unknown: [
    "allegation_only", "complaint", "investigation", "arrest", "remand", "bail",
    "indictment", "trial", "convicted", "acquitted", "dismissed", "withdrawn",
    "settled", "appeal_pending", "appeal_successful", "appeal_unsuccessful", "completed",
  ],
};

export function isAllowedStageTransition(from: CaseStage, to: CaseStage): boolean {
  if (from === to) return true;
  return ALLOWED_NEXT_STAGES[from]?.includes(to) ?? false;
}

/**
 * Anti-hallucination guard (spec section 16, rules 5-7): an indictment is never a
 * conviction, an investigation is never proof of guilt, and only a real "convicted"
 * or "acquitted" case stage may back a CONVICTION / ACQUITTAL claim classification.
 */
export function isClaimClassificationConsistentWithStage(
  classification: ClaimClassification,
  stage: CaseStage | undefined,
): boolean {
  if (classification === "conviction") return stage === "convicted";
  if (classification === "acquittal") return stage === "acquitted" || stage === "dismissed";
  return true;
}
