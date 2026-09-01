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

  if (isLoading) return <p className="text-sm text-gray-500">Loading case...</p>;
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
          <h1 className="text-xl font-semibold text-gray-900">{legalCase.caseName}</h1>
          <PublicationStatusBadge status={legalCase.publicationStatus} />
        </div>
        <p className="text-sm text-gray-600">
          {legalCase.court || "Court unknown"}{legalCase.caseNumber ? ` · Case No. ${legalCase.caseNumber}` : ""} · {legalCase.jurisdiction || legalCase.country}
        </p>
      </div>

      <dl className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase text-gray-500">Case Type</dt>
          <dd className="capitalize text-gray-900">{legalCase.caseType.replace("_", " ")}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-gray-500">Legal Stage</dt>
          <dd className="text-gray-900">{CASE_STAGE_LABELS[legalCase.legalStage]}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-gray-500">Date Filed</dt>
          <dd className="text-gray-900">{legalCase.dateFiled ? formatDate(legalCase.dateFiled) : "Unknown"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-gray-500">Next Known Step</dt>
          <dd className="text-gray-900">{legalCase.nextKnownStep || "Not recorded"}</dd>
        </div>
      </dl>

      {legalCase.allegations && (
        <div>
          <h2 className="font-semibold text-gray-900">Allegations (unproven claims)</h2>
          <p className="mt-1 text-sm text-gray-800">{legalCase.allegations}</p>
        </div>
      )}

      {legalCase.charges && legalCase.charges.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900">Charges</h2>
          <ul className="mt-1 list-inside list-disc text-sm text-gray-800">
            {legalCase.charges.map((charge) => <li key={charge}>{charge}</li>)}
          </ul>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-gray-900">Current Status</h2>
        <p className="mt-1 text-sm text-gray-800">{legalCase.currentStatus}</p>
        {legalCase.latestDevelopment && (
          <p className="mt-1 text-sm text-gray-600">Latest development: {legalCase.latestDevelopment}</p>
        )}
      </div>

      {claims.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900">Fact vs Allegation</h2>
          <div className="mt-2 overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Claim</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Classification</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
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
        <h2 className="font-semibold text-gray-900">Sources</h2>
        <div className="mt-2">
          <SourceList sources={sources} />
        </div>
      </div>
    </div>
  );
}
