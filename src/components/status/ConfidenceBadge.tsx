const CLASSES: Record<string, string> = {
  high: "bg-status-verified-bg text-status-verified border-status-verified/25",
  medium: "bg-status-pending-bg text-status-pending border-status-pending/25",
  low: "bg-status-critical-bg text-status-critical border-status-critical/25",
  unresolved: "bg-status-neutral-bg text-status-neutral border-status-neutral/25",
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
