import { Landmark, Gavel, Search, Scale, type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";

export type TimelineCategory = "political" | "legal" | "investigation" | "case";

export interface TimelineEntry {
  id: string;
  date: string;
  category: TimelineCategory;
  eyebrow: string;
  title: string;
  description?: string;
  note?: string;
  current?: boolean;
}

const CATEGORY_CONFIG: Record<TimelineCategory, { icon: LucideIcon; dot: string; text: string }> = {
  political: { icon: Landmark, dot: "bg-status-info", text: "text-status-info" },
  legal: { icon: Gavel, dot: "bg-status-critical", text: "text-status-critical" },
  investigation: { icon: Search, dot: "bg-status-pending", text: "text-status-pending" },
  case: { icon: Scale, dot: "bg-accent", text: "text-accent" },
};

export function Timeline({ entries, emptyMessage = "No timeline events recorded." }: { entries: TimelineEntry[]; emptyMessage?: string }) {
  if (entries.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <ol className="relative space-y-7 border-l-2 border-line pl-6">
      {entries.map((entry) => {
        const { icon: Icon, dot, text } = CATEGORY_CONFIG[entry.category];
        return (
          <li key={entry.id} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[31px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-bg ${dot}`}
            >
              <Icon size={12} className="text-white" aria-hidden="true" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`text-xs font-semibold uppercase tracking-wide ${text}`}>{entry.eyebrow}</p>
              {entry.current && (
                <span className="chip border-status-verified/25 bg-status-verified-bg py-0 text-[10px] font-semibold text-status-verified">
                  Current
                </span>
              )}
            </div>
            <h3 className="mt-0.5 font-medium text-ink">{entry.title}</h3>
            {entry.description && <p className="mt-1 text-sm leading-relaxed text-ink-muted">{entry.description}</p>}
            {entry.note && <p className="mt-1 text-sm italic text-ink-faint">{entry.note}</p>}
          </li>
        );
      })}
    </ol>
  );
}
