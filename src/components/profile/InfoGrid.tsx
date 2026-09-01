import type { LucideIcon } from "lucide-react";

export interface InfoGridItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function InfoGrid({ items }: { items: InfoGridItem[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="bg-surface px-4 py-4">
          <dt className="flex items-center gap-1.5 text-xs text-ink-faint">
            <Icon size={13} aria-hidden="true" />
            {label}
          </dt>
          <dd className="mt-1.5 truncate text-[15px] font-medium text-ink" title={value}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
