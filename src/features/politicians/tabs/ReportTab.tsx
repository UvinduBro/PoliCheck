import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianCases, usePoliticianEvents, usePoliticianInvestigations, usePoliticianSources } from "../api";
import { usePoliticianClaims } from "@/features/cases/api";
import { useCreateReport, useLatestReportForPolitician } from "@/features/reports/api";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/lib/permissions/roles";
import { buildReportMarkdown } from "@/lib/reports/buildReportMarkdown";
import { casesToCsv, triggerDownload } from "@/lib/export/download";
import { formatDate } from "@/lib/formatting/date";

export function ReportTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { user, userProfile } = useAuth();
  const { data: cases = [] } = usePoliticianCases(politician.id, userProfile?.role);
  const { data: investigations = [] } = usePoliticianInvestigations(politician.id, userProfile?.role);
  const { data: events = [] } = usePoliticianEvents(politician.id, userProfile?.role);
  const { data: politicianClaims = [] } = usePoliticianClaims(politician.id);
  const sourceIds = [...cases.flatMap((c) => c.sourceIds), ...investigations.flatMap((i) => i.sourceIds), ...events.flatMap((e) => e.sourceIds)];
  const { data: sources = [] } = usePoliticianSources(sourceIds);
  const { data: latestReport, refetch } = useLatestReportForPolitician(politician.id);
  const createReport = useCreateReport(user?.uid ?? "");
  const [generating, setGenerating] = useState(false);

  async function onGenerate() {
    setGenerating(true);
    try {
      const markdown = buildReportMarkdown({
        politician,
        cases,
        investigations,
        events,
        claims: politicianClaims,
        sources,
        researchCutoffIso: new Date().toISOString(),
        confidenceLevel: politician.identityConfidence === "unresolved" ? "low" : "medium",
      });
      await createReport.mutateAsync({
        politicianId: politician.id,
        title: `${politician.fullName} — Research Report`,
        researchDate: new Date().toISOString().slice(0, 10),
        researchCutoff: Timestamp.now(),
        contentMarkdown: markdown,
        confidenceLevel: politician.identityConfidence === "unresolved" ? "low" : "medium",
        status: "draft",
      });
      await refetch();
    } finally {
      setGenerating(false);
    }
  }

  function onExportMarkdown() {
    if (!latestReport) return;
    triggerDownload(`${politician.fullName.replace(/\s+/g, "-")}-report.md`, latestReport.contentMarkdown, "text/markdown");
  }

  function onExportCsv() {
    const csv = casesToCsv(cases);
    triggerDownload(`${politician.fullName.replace(/\s+/g, "-")}-cases.csv`, csv, "text/csv");
  }

  function onExportJson() {
    if (!can.createRecords(userProfile?.role)) return;
    triggerDownload(
      `${politician.fullName.replace(/\s+/g, "-")}-data.json`,
      JSON.stringify({ politician, cases, investigations, events, sources }, null, 2),
      "application/json",
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Full Report</h2>
        <div className="flex flex-wrap gap-2">
          {can.createRecords(userProfile?.role) && (
            <button type="button" className="btn-secondary" onClick={onGenerate} disabled={generating}>
              {generating ? "Generating..." : "Generate report from current data"}
            </button>
          )}
          {latestReport && (
            <>
              <button type="button" className="btn-secondary" onClick={onExportMarkdown}>Export Markdown</button>
              <button type="button" className="btn-secondary" onClick={onExportCsv}>Export Cases CSV</button>
              {can.createRecords(userProfile?.role) && (
                <button type="button" className="btn-secondary" onClick={onExportJson}>Export JSON</button>
              )}
              <button type="button" className="btn-secondary print:hidden" onClick={() => window.print()}>Print</button>
            </>
          )}
        </div>
      </div>

      {!latestReport && (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          No report has been generated for this profile yet.
        </p>
      )}

      {latestReport && (
        <article className="card prose prose-sm mt-4 max-w-none p-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Report status: {latestReport.status} · Confidence: {latestReport.confidenceLevel} · Research date:{" "}
            {formatDate(latestReport.researchDate)}
          </p>
          {/* react-markdown renders Markdown to React elements without a raw-HTML plugin, so no dangerouslySetInnerHTML is involved and inline HTML in the source is never executed. */}
          <ReactMarkdown>{latestReport.contentMarkdown}</ReactMarkdown>
        </article>
      )}
    </div>
  );
}
