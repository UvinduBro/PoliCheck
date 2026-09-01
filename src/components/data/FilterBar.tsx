export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export function FilterBar<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-accent bg-accent text-accent-fg"
                : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span className={active ? "text-accent-fg/80" : "text-ink-faint"}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
