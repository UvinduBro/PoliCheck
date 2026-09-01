import type { PublicationStatus } from "@/types";

const CLASSES: Record<PublicationStatus, string> = {
  draft: "bg-status-neutral-bg text-status-neutral border-status-neutral/25",
  review: "bg-status-info-bg text-status-info border-status-info/25",
  published: "bg-status-verified-bg text-status-verified border-status-verified/25",
  archived: "bg-surface-2 text-ink-faint border-line",
};

const LABELS: Record<PublicationStatus, string> = {
  draft: "Draft",
  review: "In Review",
  published: "Published",
  archived: "Archived",
};

export function PublicationStatusBadge({ status }: { status: PublicationStatus }) {
  return <span className={`chip font-medium ${CLASSES[status]}`}>{LABELS[status]}</span>;
}
