import type { PublicationStatus } from "@/types";

const CLASSES: Record<PublicationStatus, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-300",
  review: "bg-blue-50 text-blue-800 border-blue-200",
  published: "bg-green-50 text-green-800 border-green-200",
  archived: "bg-gray-50 text-gray-500 border-gray-200",
};

const LABELS: Record<PublicationStatus, string> = {
  draft: "Draft",
  review: "In Review",
  published: "Published",
  archived: "Archived",
};

export function PublicationStatusBadge({ status }: { status: PublicationStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CLASSES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
