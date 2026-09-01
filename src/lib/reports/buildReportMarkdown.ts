import { CASE_STAGE_LABELS, CLAIM_CLASSIFICATION_LABELS, FREEDOM_STATUS_LABELS } from "@/constants/legalStatus";
import { formatDate } from "@/lib/formatting/date";
import { deriveFreedomStatus } from "@/lib/legal-status/freedomStatus";
import { isActiveCaseStage } from "@/lib/legal-status/caseStage";
import type { Claim, Investigation, LegalCase, LegalEvent, Politician, Source } from "@/types";

export interface BuildReportInput {
  politician: Politician;
  cases: LegalCase[];
  investigations: Investigation[];
  events: LegalEvent[];
  claims: Claim[];
  sources: Source[];
  researchCutoffIso: string;
  confidenceLevel: "high" | "medium" | "low";
}

function sourceRef(sourceIds: string[], sources: Source[]): string {
  const titles = sourceIds
    .map((id) => sources.find((s) => s.id === id)?.title)
    .filter((t): t is string => Boolean(t));
  return titles.length > 0 ? `[${titles.join("; ")}]` : "[Source not on file]";
}

/**
 * Assembles the required 22-section report (spec sections 11-12) from live,
 * already-verified data only. Never fabricates a case number, judgment, or
 * status — every fact-bearing line cites its source, and unresolved sections
 * say so explicitly rather than guessing.
 */
export function buildReportMarkdown(input: BuildReportInput): string {
  const { politician, cases, investigations, events, claims, sources, researchCutoffIso, confidenceLevel } = input;

  const freedom = deriveFreedomStatus(events, sources);
  const activeCases = cases.filter((c) => isActiveCaseStage(c.legalStage));
  const convictions = cases.filter((c) => c.legalStage === "convicted");
  const acquittals = cases.filter((c) => c.legalStage === "acquitted");

  const lines: string[] = [];
  const h = (n: number, text: string) => lines.push(`${"#".repeat(n)} ${text}`, "");
  const p = (text: string) => lines.push(text, "");

  h(1, politician.fullName);
  p(`RESEARCH CUTOFF: ${formatDate(researchCutoffIso)}`);
  p(`CONFIDENCE LEVEL: ${confidenceLevel.toUpperCase()}`);

  h(2, "1. Executive Summary");
  p(
    `${politician.fullName} currently holds the position of ${politician.currentPosition || "an undetermined position"} ` +
      `in ${politician.country}. ${activeCases.length} active court case(s) and ` +
      `${investigations.filter((i) => i.currentStatus === "open").length} open investigation(s) are on file. ` +
      `${convictions.length} conviction(s) and ${acquittals.length} acquittal(s) are recorded.`,
  );

  h(2, "2. Identity Verification");
  p(`Identity confidence: ${politician.identityConfidence}.`);
  if (politician.alternativeNames.length || politician.localLanguageNames.length || politician.nicknames.length) {
    p(
      `Known as: ${[...politician.alternativeNames, ...politician.localLanguageNames, ...politician.nicknames].join(", ")}.`,
    );
  }

  h(2, "3. Biography");
  p(politician.biography || "No biography has been recorded.");

  h(2, "4. Political History");
  p("See the Political History tab for a full list of positions held.");

  h(2, "5. Current Political Position");
  p(politician.currentPosition || "Not established.");

  h(2, "6. Current Imprisonment or Detention Status");
  p(`CURRENT INCARCERATION STATUS: ${freedom.status.toUpperCase()}`);
  if (freedom.confidence === "unresolved") {
    p("Current incarceration status could not be conclusively verified from authoritative sources.");
  } else {
    p(`Status: ${FREEDOM_STATUS_LABELS[freedom.status]} (${freedom.confidence} confidence).`);
  }

  const criminalCases = cases.filter((c) => c.caseType === "criminal");
  const civilCases = cases.filter((c) => c.caseType === "civil");
  const corruptionInvestigations = investigations.filter(
    (i) => i.investigationType === "corruption" || i.investigationType === "financial",
  );
  const policeInvestigations = investigations.filter((i) => i.investigationType === "police");

  h(2, "7. Criminal Cases");
  p(criminalCases.length === 0 ? "None on file." : criminalCases.map((c) => `- ${c.caseName} (${CASE_STAGE_LABELS[c.legalStage]}) ${sourceRef(c.sourceIds, sources)}`).join("\n"));

  h(2, "8. Civil Cases");
  p(civilCases.length === 0 ? "None on file." : civilCases.map((c) => `- ${c.caseName} (${CASE_STAGE_LABELS[c.legalStage]}) ${sourceRef(c.sourceIds, sources)}`).join("\n"));

  h(2, "9. Corruption and Financial Investigations");
  p(corruptionInvestigations.length === 0 ? "None on file." : corruptionInvestigations.map((i) => `- ${i.agency}: ${i.currentStatus} ${sourceRef(i.sourceIds, sources)}`).join("\n"));

  h(2, "10. Police Investigations");
  p(policeInvestigations.length === 0 ? "None on file." : policeInvestigations.map((i) => `- ${i.agency}: ${i.currentStatus} ${sourceRef(i.sourceIds, sources)}`).join("\n"));

  h(2, "11. Court Proceedings");
  p(`ONGOING LEGAL PROCEEDINGS: ${activeCases.length > 0 ? "YES" : cases.length > 0 ? "NO" : "UNCLEAR"}`);
  if (activeCases.length > 0) {
    p(
      activeCases
        .map(
          (c) =>
            `- ${c.caseName} | ${c.court || "Court unknown"} | ${c.caseNumber || "No case number on file"} | ${CASE_STAGE_LABELS[c.legalStage]} | Next: ${c.nextKnownStep || "Unknown"} ${sourceRef(c.sourceIds, sources)}`,
        )
        .join("\n"),
    );
  }

  h(2, "12. Convictions");
  p(convictions.length === 0 ? "None on file." : convictions.map((c) => `- ${c.caseName} ${sourceRef(c.sourceIds, sources)}`).join("\n"));

  h(2, "13. Acquittals");
  p(acquittals.length === 0 ? "None on file." : acquittals.map((c) => `- ${c.caseName} ${sourceRef(c.sourceIds, sources)}`).join("\n"));

  const appeals = cases.filter((c) => c.legalStage.startsWith("appeal"));
  h(2, "14. Appeals");
  p(appeals.length === 0 ? "None on file." : appeals.map((c) => `- ${c.caseName}: ${CASE_STAGE_LABELS[c.legalStage]} ${sourceRef(c.sourceIds, sources)}`).join("\n"));

  const warrantEvents = events.filter((e) => e.eventType === "warrant");
  const bailEvents = events.filter((e) => e.eventType === "bail");
  h(2, "15. Warrants and Bail");
  p(
    [
      ...warrantEvents.map((e) => `- Warrant: ${e.title} (${formatDate(e.date)}) ${sourceRef(e.sourceIds, sources)}`),
      ...bailEvents.map((e) => `- Bail: ${e.title} (${formatDate(e.date)}) ${sourceRef(e.sourceIds, sources)}`),
    ].join("\n") || "None on file.",
  );

  const travelEvents = events.filter((e) => e.eventType === "travel_restriction");
  h(2, "16. Travel Restrictions");
  p(travelEvents.length === 0 ? "None on file." : travelEvents.map((e) => `- ${e.title} (${formatDate(e.date)}) ${sourceRef(e.sourceIds, sources)}`).join("\n"));

  h(2, "17. Major Controversies");
  p("See classified claims in the Fact vs Allegation table below for disputed or unverified matters.");

  h(2, "18. Legal Timeline");
  const sortedEvents = [...events].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  p(sortedEvents.length === 0 ? "No timeline events recorded." : sortedEvents.map((e) => `- ${formatDate(e.date)}: ${e.title} ${sourceRef(e.sourceIds, sources)}`).join("\n"));

  h(2, "19. Current Legal Status Dashboard");
  p(
    [
      `- Active criminal cases: ${cases.filter((c) => c.caseType === "criminal" && isActiveCaseStage(c.legalStage)).length}`,
      `- Active civil cases: ${cases.filter((c) => c.caseType === "civil" && isActiveCaseStage(c.legalStage)).length}`,
      `- Active investigations: ${investigations.filter((i) => i.currentStatus === "open").length}`,
      `- Convictions: ${convictions.length}`,
      `- Acquittals: ${acquittals.length}`,
      `- Pending appeals: ${cases.filter((c) => c.legalStage === "appeal_pending").length}`,
    ].join("\n"),
  );

  h(2, "20. Fact vs Allegation Table");
  if (claims.length === 0) {
    p("No individually classified claims are on file for this profile.");
  } else {
    lines.push("| Claim | Classification | Evidence | Current Status |", "| --- | --- | --- | --- |");
    for (const claim of claims) {
      lines.push(
        `| ${claim.text.replace(/\|/g, "/")} | ${CLAIM_CLASSIFICATION_LABELS[claim.classification]} | ${sourceRef(claim.sourceIds, sources)} | ${claim.currentStatus || "—"} |`,
      );
    }
    lines.push("");
  }

  h(2, "21. Final Assessment");
  p(
    `This report reflects information available and verified as of the research cutoff above, at ${confidenceLevel} confidence. ` +
      "Allegations, complaints, and open investigations described here are not findings of guilt. Where a status could not be conclusively verified, that limitation is stated explicitly rather than inferred.",
  );

  h(2, "22. Complete Sources");
  if (sources.length === 0) {
    p("No sources on file.");
  } else {
    lines.push(...sources.map((s) => `- ${s.title} — ${s.publisher} (Tier ${s.tier}, ${s.url})`), "");
  }

  p(`IMPORTANT LIMITATIONS: ${politician.identityConfidence === "unresolved" ? "Identity is unresolved; some records may describe more than one person. " : ""}${freedom.confidence === "unresolved" ? "Current freedom status is unresolved due to conflicting or insufficient sources." : "None beyond what is stated above."}`);

  return lines.join("\n").trim();
}
