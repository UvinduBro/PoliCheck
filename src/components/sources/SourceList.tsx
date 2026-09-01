import { SourceCard } from "./SourceCard";
import type { Source } from "@/types";

export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return <p className="text-sm text-gray-500">No sources recorded.</p>;
  }
  return (
    <ul className="space-y-3">
      {sources.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
    </ul>
  );
}
