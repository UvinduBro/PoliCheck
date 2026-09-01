import { SOURCE_TIER_LABELS } from "@/constants/sourceTiers";
import type { SourceTier } from "@/types";

const CLASSES: Record<SourceTier, string> = {
  1: "bg-green-50 text-green-800 border-green-200",
  2: "bg-blue-50 text-blue-800 border-blue-200",
  3: "bg-amber-50 text-amber-800 border-amber-200",
  4: "bg-red-50 text-red-800 border-red-200",
};

export function SourceTierBadge({ tier }: { tier: SourceTier }) {
  return (
    <span
      title={SOURCE_TIER_LABELS[tier]}
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CLASSES[tier]}`}
    >
      Tier {tier}
    </span>
  );
}
