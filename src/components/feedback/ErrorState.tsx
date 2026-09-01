import type { ReactNode } from "react";
import { OctagonAlert } from "lucide-react";

export function ErrorState({
  title = "We couldn't load this information",
  description = "Something went wrong while fetching this. Try again in a moment.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-status-critical/25 bg-status-critical-bg px-6 py-10 text-center">
      <OctagonAlert size={22} className="text-status-critical" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
