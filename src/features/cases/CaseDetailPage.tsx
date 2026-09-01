import { useParams } from "react-router-dom";
import { useCase, useCaseClaims } from "./api";
import { usePoliticianSources } from "@/features/politicians/api";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { SourceList } from "@/components/sources/SourceList";
import { CASE_STAGE_LABELS, CLAIM_CLASSIFICATION_LABELS } from "@/constants/legalStatus";
import { formatDate } from "@/lib/formatting/date";

export function CaseDetailPage() {
  const { caseId } = useParams();
  const { data: legalCase, isLoading, error } = useCase(caseId);
  const { data: claims = [] } = useCaseClaims(caseId);
  const { data: sources = [] } = usePoliticianSources(legalCase?.sourceIds ?? []);

  if (isLoading) return <p className="text-sm text-slate-500 dark:text-slate-400">Loading case...</p>;
  if (error || !legalCase) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        This case could not be found, or you do not have access to view it.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{legalCase.caseName}</h1>
          <PublicationStatusBadge status={legalCase.publicationStatus} />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {legalCase.court || "Court unknown"}{legalCase.caseNumber ? ` · Case No. ${legalCase.caseNumber}` : ""} · {legalCase.jurisdiction || legalCase.country}
        </p>
      </div>

      <dl className="grid gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Case Type</dt>
          <dd className="capitalize text-slate-900 dark:text-white">{legalCase.caseType.replace("_", " ")}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Legal Stage</dt>
          <dd className="text-slate-900 dark:text-white">{CASE_STAGE_LABELS[legalCase.legalStage]}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Date Filed</dt>
          <dd className="text-slate-900 dark:text-white">{legalCase.dateFiled ? formatDate(legalCase.dateFiled) : "Unknown"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Next Known Step</dt>
          <dd className="text-slate-900 dark:text-white">{legalCase.nextKnownStep || "Not recorded"}</dd>
        </div>
      </dl>

      {legalCase.allegations && (
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Allegations (unproven claims)</h2>
          <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{legalCase.allegations}</p>
        </div>
      )}

      {legalCase.charges && legalCase.charges.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Charges</h2>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-800 dark:text-slate-200">
            {legalCase.charges.map((charge) => <li key={charge}>{charge}</li>)}
          </ul>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">Current Status</h2>
        <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{legalCase.currentStatus}</p>
        {legalCase.latestDevelopment && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Latest development: {legalCase.latestDevelopment}</p>
        )}
      </div>

      {claims.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Fact vs Allegation</h2>
          <div className="mt-2 overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Claim</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Classification</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td className="px-3 py-2 align-top">{claim.text}</td>
                    <td className="px-3 py-2 align-top font-medium">{CLAIM_CLASSIFICATION_LABELS[claim.classification]}</td>
                    <td className="px-3 py-2 align-top">{claim.currentStatus || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">Sources</h2>
        <div className="mt-2">
          <SourceList sources={sources} />
        </div>
      </div>
    </div>
  );
}
