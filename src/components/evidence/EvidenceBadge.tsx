import { CircleHelp, MessageSquareQuote, ShieldCheck, TriangleAlert } from "lucide-react";
import { CLAIM_CLASSIFICATION_LABELS } from "@/constants/legalStatus";
import type { ClaimClassification } from "@/types";

type EvidenceTier = "fact" | "allegation" | "claim" | "unverified";

const TIER_BY_CLASSIFICATION: Record<ClaimClassification, EvidenceTier> = {
  verified_fact: "fact",
  court_finding: "fact",
  conviction: "fact",
  acquittal: "fact",
  formal_allegation: "allegation",
  ongoing_investigation: "allegation",
  media_report: "claim",
  political_claim: "claim",
  unverified_claim: "unverified",
};

/**
 * The signature fact-vs-allegation visual language (design spec §15). Each evidentiary
 * tier gets a genuinely different treatment — not just a different color on the same
 * shape — so a reader never mistakes an allegation's weight for a verified fact's.
 */
const TIER_STYLES: Record<EvidenceTier, { icon: typeof ShieldCheck; className: string }> = {
  fact: {
    icon: ShieldCheck,
    className: "border-status-verified/30 bg-status-verified-bg text-status-verified",
  },
  allegation: {
    icon: TriangleAlert,
    className: "border-status-pending/30 bg-status-pending-bg text-status-pending",
  },
  claim: {
    icon: MessageSquareQuote,
    className: "border-line-strong bg-surface-2 text-ink-muted",
  },
  unverified: {
    icon: CircleHelp,
    className: "border-dashed border-line-strong bg-transparent text-ink-faint",
  },
};

export function EvidenceBadge({
  classification,
  className = "",
}: {
  classification: ClaimClassification;
  className?: string;
}) {
  const tier = TIER_BY_CLASSIFICATION[classification];
  const { icon: Icon, className: tierClassName } = TIER_STYLES[tier];
  const isFact = tier === "fact";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isFact ? "" : "font-medium"
      } ${tierClassName} ${className}`}
    >
      <Icon size={13} aria-hidden="true" />
      {CLAIM_CLASSIFICATION_LABELS[classification]}
    </span>
  );
}

export function evidenceTierIcon(classification: ClaimClassification) {
  return TIER_STYLES[TIER_BY_CLASSIFICATION[classification]].icon;
}
