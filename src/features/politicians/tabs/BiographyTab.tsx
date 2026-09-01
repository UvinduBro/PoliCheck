import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";

export function BiographyTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();

  return (
    <div className="card space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Biography</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-800">
          {politician.biography || "No biography has been recorded yet."}
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase text-gray-500">Profession</dt>
          <dd className="text-sm text-gray-900">{politician.profession || "Unknown"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-gray-500">Education</dt>
          <dd className="text-sm text-gray-900">{politician.education?.join(", ") || "Not recorded"}</dd>
        </div>
      </dl>
    </div>
  );
}
