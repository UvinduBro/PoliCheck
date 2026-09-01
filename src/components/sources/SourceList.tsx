import { SourceCard } from "./SourceCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import type { Source } from "@/types";

export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return <EmptyState title="No sources recorded" description="No citations are on file for this record yet." />;
  }
  return (
    <ul className="space-y-3">
      {sources.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
    </ul>
  );
}
