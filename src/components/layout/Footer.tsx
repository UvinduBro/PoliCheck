import { ShieldAlert } from "lucide-react";
import { CivicLensMark } from "./CivicLensMark";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2 text-ink">
          <CivicLensMark size={16} className="text-accent" />
          <span className="text-sm font-semibold tracking-tight">CivicLens</span>
          <span className="text-sm text-ink-faint">— See the record. Know the facts.</span>
        </div>

        <div className="mt-5 space-y-3 text-sm text-ink-muted">
          <p className="flex items-start gap-2 font-medium text-ink">
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-status-pending" aria-hidden="true" />
            Allegations are not convictions. An indictment, complaint, or investigation is not proof of guilt.
          </p>
          <p className="max-w-3xl">
            CivicLens presents structured, source-cited research. Every significant claim is linked to its
            original source and classified as a verified fact, court finding, allegation, investigation,
            media report, or political claim. Where information could not be verified, that limitation is
            stated explicitly rather than presented as fact.
          </p>
          <p className="max-w-3xl">
            Found an error? Every published profile includes a "Report an error" action, and disputed
            information is flagged for reviewer confirmation before it is used to describe someone's current
            legal status.
          </p>
        </div>

        <p className="mt-6 border-t border-line pt-5 text-xs text-ink-faint">
          &copy; {new Date().getFullYear()} CivicLens. Structured research, not legal advice.
        </p>
      </div>
    </footer>
  );
}
