import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { useReport } from "./api";
import { formatDate } from "@/lib/formatting/date";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { ConfidenceBadge } from "@/components/status/ConfidenceBadge";

export function ReportPage() {
  const { reportId } = useParams();
  const { data: report, isLoading, error } = useReport(reportId);

  if (isLoading) return <p className="text-sm text-gray-500">Loading report...</p>;
  if (error || !report) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        This report could not be found, or you do not have access to view it.
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-gray-900">{report.title}</h1>
        <div className="flex items-center gap-2">
          <PublicationStatusBadge status={report.status} />
          <ConfidenceBadge level={report.confidenceLevel} />
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Research date: {formatDate(report.researchDate)} · Research cutoff: {formatDate(report.researchCutoff)}
      </p>
      {report.limitations && (
        <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">{report.limitations}</p>
      )}
      <div className="prose prose-sm mt-6 max-w-none">
        <ReactMarkdown>{report.contentMarkdown}</ReactMarkdown>
      </div>
    </article>
  );
}
