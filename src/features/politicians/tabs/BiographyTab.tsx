import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { EmptyState } from "@/components/feedback/EmptyState";

export function BiographyTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="text-section-heading font-semibold text-ink">Biography</h2>
        {politician.biography ? (
          <p className="font-serif-report mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
            {politician.biography}
          </p>
        ) : (
          <div className="mt-3">
            <EmptyState title="No biography has been recorded yet" />
          </div>
        )}
      </section>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <dt className="text-xs text-ink-faint">Profession</dt>
          <dd className="mt-1 text-sm font-medium text-ink">{politician.profession || "Unknown"}</dd>
        </div>
        <div className="card p-5">
          <dt className="text-xs text-ink-faint">Education</dt>
          <dd className="mt-1 text-sm font-medium text-ink">{politician.education?.join(", ") || "Not recorded"}</dd>
        </div>
      </dl>
    </div>
  );
}
