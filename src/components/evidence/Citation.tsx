import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SourceTierBadge } from "@/components/sources/SourceTierBadge";
import { formatDate } from "@/lib/formatting/date";
import type { Source } from "@/types";

/**
 * A compact numbered citation marker — click to reveal the source it points to without
 * leaving the page. Used anywhere a claim, event, or fact is backed by a specific source
 * (design spec §17).
 */
export function Citation({ index, source }: { index: number; source: Source | undefined }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!source) {
    return <sup className="ml-0.5 text-xs text-ink-faint">[{index}]</sup>;
  }

  return (
    <span className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Source ${index}: ${source.title}`}
        className="ml-0.5 rounded px-0.5 align-super text-xs font-medium text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
      >
        [{index}]
      </button>
      {open && (
        <span
          role="dialog"
          aria-label="Source details"
          className="animate-scale-in absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-lg border border-line bg-surface p-4 text-left shadow-elevated"
        >
          <span className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium leading-snug text-ink">{source.title}</span>
            <SourceTierBadge tier={source.tier} />
          </span>
          <span className="mt-1 block text-xs text-ink-muted">{source.publisher}</span>
          <span className="mt-2 flex items-center gap-2 text-xs text-ink-faint">
            {source.publicationDate && <span>{formatDate(source.publicationDate)}</span>}
            <span className="capitalize">{source.verificationStatus.replace("_", " ")}</span>
          </span>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            Open source <ExternalLink size={12} aria-hidden="true" />
          </a>
        </span>
      )}
    </span>
  );
}
