const CLASSES: Record<string, string> = {
  high: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  medium: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  low: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  unresolved: "bg-slate-50 text-slate-700 border-slate-200 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
};

const LABELS: Record<string, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
  unresolved: "Unresolved",
};

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" | "unresolved" }) {
  return <span className={`chip font-medium ${CLASSES[level]}`}>{LABELS[level]}</span>;
}
