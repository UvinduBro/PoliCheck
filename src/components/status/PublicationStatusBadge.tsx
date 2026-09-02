import { useTranslation } from "react-i18next";
import type { PublicationStatus } from "@/types";

const CLASSES: Record<PublicationStatus, string> = {
  draft: "bg-status-neutral-bg text-status-neutral border-status-neutral/25",
  review: "bg-status-info-bg text-status-info border-status-info/25",
  published: "bg-status-verified-bg text-status-verified border-status-verified/25",
  archived: "bg-surface-2 text-ink-faint border-line",
};

export function PublicationStatusBadge({ status }: { status: PublicationStatus }) {
  const { t } = useTranslation();
  return <span className={`chip font-medium ${CLASSES[status]}`}>{t(`profile.publicationStatus.${status}`)}</span>;
}
