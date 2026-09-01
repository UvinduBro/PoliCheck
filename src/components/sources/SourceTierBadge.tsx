import { SOURCE_TIER_LABELS } from "@/constants/sourceTiers";
import type { SourceTier } from "@/types";

const CLASSES: Record<SourceTier, string> = {
  1: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  2: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  3: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  4: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};

export function SourceTierBadge({ tier }: { tier: SourceTier }) {
  return (
    <span title={SOURCE_TIER_LABELS[tier]} className={`chip py-0.5 font-medium ${CLASSES[tier]}`}>
      Tier {tier}
    </span>
  );
}
