import { useParams } from "react-router-dom";
import { useReport } from "./api";
import { formatDate } from "@/lib/formatting/date";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { ConfidenceBadge } from "@/components/status/ConfidenceBadge";
import { ReportDocument } from "@/components/reports/ReportDocument";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/feedback/Skeleton";

export function ReportPage() {
  const { reportId } = useParams();
  const { data: report, isLoading, error } = useReport(reportId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-3xl">
        <ErrorState title="Report not found" description="This report could not be found, or you do not have access to view it." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ReportDocument
        eyebrow="Investigative dossier"
        title={report.title}
        badges={
          <>
            <PublicationStatusBadge status={report.status} />
            <ConfidenceBadge level={report.confidenceLevel} />
          </>
        }
        meta={`Research date: ${formatDate(report.researchDate)} · Research cutoff: ${formatDate(report.researchCutoff)}`}
        limitations={report.limitations}
        markdown={report.contentMarkdown}
      />
    </div>
  );
}
