import type { ReactNode } from "react";
import { OctagonAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ErrorState({
  title,
  description,
  detail,
  action,
}: {
  title?: string;
  description?: string;
  /** Raw error message (e.g. error.message from a failed query) — shown as a technical detail to help diagnose config issues like a missing Firestore index or a security rule denial. */
  detail?: string;
  action?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center rounded-lg border border-status-critical/25 bg-status-critical-bg px-6 py-10 text-center">
      <OctagonAlert size={22} className="text-status-critical" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-ink">{title ?? t("errorState.title")}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{description ?? t("errorState.description")}</p>
      {detail && (
        <p className="mt-2 max-w-md break-words rounded border border-status-critical/20 bg-surface px-3 py-2 font-mono text-xs text-ink-faint">
          {detail}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
