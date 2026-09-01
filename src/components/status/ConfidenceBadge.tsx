const CLASSES: Record<string, string> = {
  high: "bg-green-50 text-green-800 border-green-200",
  medium: "bg-amber-50 text-amber-800 border-amber-200",
  low: "bg-orange-50 text-orange-800 border-orange-200",
  unresolved: "bg-gray-50 text-gray-700 border-gray-200",
};

const LABELS: Record<string, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
  unresolved: "Unresolved",
};

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" | "unresolved" }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CLASSES[level]}`}>
      {LABELS[level]}
    </span>
  );
}
