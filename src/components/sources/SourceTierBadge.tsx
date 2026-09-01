import { SOURCE_TIER_LABELS } from "@/constants/sourceTiers";
import type { SourceTier } from "@/types";

const CLASSES: Record<SourceTier, string> = {
  1: "bg-status-verified-bg text-status-verified border-status-verified/25",
  2: "bg-status-info-bg text-status-info border-status-info/25",
  3: "bg-status-pending-bg text-status-pending border-status-pending/25",
  4: "bg-status-critical-bg text-status-critical border-status-critical/25",
};

export function SourceTierBadge({ tier }: { tier: SourceTier }) {
  return (
    <span title={SOURCE_TIER_LABELS[tier]} className={`chip py-0.5 font-medium ${CLASSES[tier]}`}>
      Tier {tier}
    </span>
  );
}
