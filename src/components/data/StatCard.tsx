import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  href,
  hrefLabel,
  icon,
}: {
  label: string;
  value: string | number;
  delta?: string;
  href?: string;
  hrefLabel?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <p className="eyebrow">{label}</p>
        {icon && <span className="text-ink-faint">{icon}</span>}
      </div>
      <p className="mt-2 font-serif-report text-3xl font-semibold tabular-nums text-ink">{value}</p>
      {delta && <p className="mt-1 text-xs text-ink-muted">{delta}</p>}
      {href && (
        <Link
          to={href}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          {hrefLabel ?? "View"}
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
