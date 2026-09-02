import { BookOpenCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { SOURCE_TIER_LABELS } from "@/constants/sourceTiers";

export function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-page-heading font-semibold text-ink">Disclaimer</h1>
      <p className="mt-1 text-sm text-ink-muted">
        How Politician Watch classifies claims, verifies sources, and why nothing here should be read as a
        finding of guilt.
      </p>

      <section className="mt-8 rounded-lg border border-status-pending/25 bg-status-pending-bg p-5">
        <h2 className="flex items-center gap-2 font-semibold text-status-pending">
          <ShieldAlert size={18} aria-hidden="true" />
          Allegations are not convictions
        </h2>
        <p className="mt-2 text-sm text-ink">
          An indictment, complaint, or open investigation is never presented here as proof of guilt. Every
          significant claim is classified (verified fact, court finding, conviction, acquittal, formal
          allegation, ongoing investigation, media report, or political claim) and linked to its source.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-section-heading font-semibold text-ink">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-accent">
            <ShieldCheck size={18} aria-hidden="true" />
          </span>
          Research methodology
        </h2>
        <p className="mt-3 text-sm text-ink-muted">
          Every profile follows a fixed workflow: identity verification, source collection, legal-record
          entry, timeline construction, independent reviewer approval, and only then publication. Draft and
          in-review material is never shown to the public.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-section-heading font-semibold text-ink">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-accent">
            <BookOpenCheck size={18} aria-hidden="true" />
          </span>
          Source quality
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
          {([1, 2, 3, 4] as const).map((tier) => (
            <li key={tier} className="flex items-baseline gap-2">
              <span className="font-medium text-ink">Tier {tier}</span>
              <span>{SOURCE_TIER_LABELS[tier].replace(/^Tier \d: /, "")}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-faint">
          Tier 4 sources (blogs, anonymous sites, social media) are never used as sole evidence of guilt.
        </p>
      </section>
    </div>
  );
}
