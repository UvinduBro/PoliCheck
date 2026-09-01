import type { PublicationStatus } from "@/types";

const CLASSES: Record<PublicationStatus, string> = {
  draft: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  review: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  published: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  archived: "bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-slate-200 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 dark:text-slate-500 dark:border-slate-700",
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
