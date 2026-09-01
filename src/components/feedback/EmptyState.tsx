import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  footnote,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  footnote?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-ink-faint">
        <Icon size={20} aria-hidden="true" />
      </span>
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>}
      {footnote && <p className="mt-3 text-xs text-ink-faint">{footnote}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
