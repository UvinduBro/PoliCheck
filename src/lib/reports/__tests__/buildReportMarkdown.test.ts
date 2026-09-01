import { describe, expect, it } from "vitest";
import { buildReportMarkdown } from "../buildReportMarkdown";
import type { Politician } from "@/types";

const politician: Politician = {
  id: "p1",
  fullName: "Jane Doe",
  alternativeNames: [],
  localLanguageNames: [],
  nicknames: [],
  country: "Sri Lanka",
  identityConfidence: "high",
  publicationStatus: "published",
  createdBy: "u1",
  createdAt: null as never,
  updatedAt: null as never,
};

describe("buildReportMarkdown", () => {
  it("uses the exact required incarceration status and proceedings format strings", () => {
    const md = buildReportMarkdown({
      politician,
      cases: [],
      investigations: [],
      events: [],
      claims: [],
      sources: [],
      researchCutoffIso: "2024-01-01",
      confidenceLevel: "medium",
    });
    expect(md).toContain("CURRENT INCARCERATION STATUS: UNKNOWN");
    expect(md).toContain("ONGOING LEGAL PROCEEDINGS: UNCLEAR");
    expect(md).toContain("RESEARCH CUTOFF:");
    expect(md).toContain("CONFIDENCE LEVEL: MEDIUM");
    expect(md).toContain("Current incarceration status could not be conclusively verified");
  });

  it("says YES for ongoing proceedings when an active case exists", () => {
    const md = buildReportMarkdown({
      politician,
      cases: [
        {
          id: "c1",
          politicianIds: ["p1"],
          caseName: "State v. Doe",
          country: "Sri Lanka",
          caseType: "criminal",
          parties: [],
          legalStage: "trial",
          currentStatus: "Ongoing",
          sourceIds: ["s1"],
          publicationStatus: "published",
          createdBy: "u1",
          createdAt: null as never,
          updatedAt: null as never,
        },
      ],
      investigations: [],
      events: [],
      claims: [],
      sources: [{ id: "s1", title: "Court Filing", publisher: "High Court", sourceType: "court_order", tier: 1, url: "https://example.com", accessedAt: null as never, verificationStatus: "verified", createdBy: "u1", createdAt: null as never, updatedAt: null as never }],
      researchCutoffIso: "2024-01-01",
      confidenceLevel: "high",
    });
    expect(md).toContain("ONGOING LEGAL PROCEEDINGS: YES");
    expect(md).toContain("State v. Doe");
  });

  it("never fabricates a case number — falls back to an explicit 'not on file' note", () => {
    const md = buildReportMarkdown({
      politician,
      cases: [
        {
          id: "c1",
          politicianIds: ["p1"],
          caseName: "State v. Doe",
          country: "Sri Lanka",
          caseType: "criminal",
          parties: [],
          legalStage: "trial",
          currentStatus: "Ongoing",
          sourceIds: [],
          publicationStatus: "published",
          createdBy: "u1",
          createdAt: null as never,
          updatedAt: null as never,
        },
      ],
      investigations: [],
      events: [],
      claims: [],
      sources: [],
      researchCutoffIso: "2024-01-01",
      confidenceLevel: "low",
    });
    expect(md).toContain("No case number on file");
    expect(md).toContain("[Source not on file]");
  });
});
