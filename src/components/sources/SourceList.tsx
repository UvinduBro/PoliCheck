import { SourceCard } from "./SourceCard";
import type { Source } from "@/types";

export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No sources recorded.</p>;
  }
  return (
    <ul className="space-y-3">
      {sources.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
    </ul>
  );
}
