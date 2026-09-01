import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";

export function BiographyTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();

  return (
    <div className="card space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Biography</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
          {politician.biography || "No biography has been recorded yet."}
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Profession</dt>
          <dd className="text-sm text-slate-900 dark:text-white">{politician.profession || "Unknown"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Education</dt>
          <dd className="text-sm text-slate-900 dark:text-white">{politician.education?.join(", ") || "Not recorded"}</dd>
        </div>
      </dl>
    </div>
  );
}
