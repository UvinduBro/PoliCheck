import { ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-10 text-sm text-slate-600 sm:px-6 dark:text-slate-400">
        <p className="flex items-start gap-2 font-medium text-slate-800 dark:text-slate-200">
          <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          Allegations are not convictions. An indictment, complaint, or investigation is not proof of guilt.
        </p>
        <p className="max-w-3xl">
          PoliCheck presents structured, source-cited research. Every significant claim is linked to its
          original source and classified as a verified fact, court finding, allegation, investigation, media
          report, or political claim. Where information could not be verified, that limitation is stated
          explicitly rather than presented as fact.
        </p>
        <p className="max-w-3xl">
          Found an error? Every published profile includes a "Report an error" action, and disputed
          information is flagged for reviewer confirmation before it is used to describe someone's current
          legal status.
        </p>
        <p className="pt-4 text-xs text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} PoliCheck. Structured research, not legal advice.
        </p>
      </div>
    </footer>
  );
}
