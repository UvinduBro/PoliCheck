import { describe, expect, it } from "vitest";
import { buildLegalStatusDashboard } from "../dashboard";
import type { Investigation, LegalCase } from "@/types";

function makeCase(overrides: Partial<LegalCase>): LegalCase {
  return {
    id: "c1",
    politicianIds: ["p1"],
    caseName: "Test Case",
    country: "Sri Lanka",
    caseType: "criminal",
    parties: [],
    legalStage: "investigation",
    currentStatus: "Ongoing",
    sourceIds: ["s1"],
    publicationStatus: "published",
    createdBy: "u1",
    createdAt: null as never,
    updatedAt: null as never,
    ...overrides,
  };
}

function makeInvestigation(overrides: Partial<Investigation>): Investigation {
  return {
    id: "i1",
    politicianIds: ["p1"],
    agency: "Anti-Corruption Bureau",
    investigationType: "corruption",
    currentStatus: "open",
    sourceIds: ["s1"],
    publicationStatus: "published",
    createdBy: "u1",
    createdAt: null as never,
    updatedAt: null as never,
    ...overrides,
  };
}

const tier1Verified = { id: "s1", tier: 1 as const, verificationStatus: "verified" as const, publicationDate: "2024-01-01" };

describe("buildLegalStatusDashboard", () => {
  it("counts active criminal/civil cases separately and only active ones", () => {
    const dashboard = buildLegalStatusDashboard({
      cases: [
        makeCase({ id: "c1", caseType: "criminal", legalStage: "trial" }),
        makeCase({ id: "c2", caseType: "criminal", legalStage: "acquitted" }),
        makeCase({ id: "c3", caseType: "civil", legalStage: "investigation" }),
      ],
      investigations: [],
      events: [],
      sources: [tier1Verified],
    });
    expect(dashboard.activeCriminalCases).toBe(1);
    expect(dashboard.activeCivilCases).toBe(1);
  });

  it("marks major legal risk high when currently incarcerated", () => {
    const dashboard = buildLegalStatusDashboard({
      cases: [],
      investigations: [],
      events: [{ id: "e1", date: "2024-01-01", eventType: "remand", sourceIds: ["s1"] }],
      sources: [tier1Verified],
    });
    expect(dashboard.freedomStatus).toBe("incarcerated");
    expect(dashboard.majorLegalRisk).toBe("high");
  });

  it("marks risk low with no active cases, investigations, or convictions", () => {
    const dashboard = buildLegalStatusDashboard({
      cases: [makeCase({ legalStage: "acquitted" })],
      investigations: [makeInvestigation({ currentStatus: "closed" })],
      events: [],
      sources: [],
    });
    expect(dashboard.majorLegalRisk).toBe("low");
  });

  it("surfaces hasConflictingSources from the underlying freedom-status conflict", () => {
    const dashboard = buildLegalStatusDashboard({
      cases: [],
      investigations: [],
      events: [
        { id: "e1", date: "2024-01-01", eventType: "release", sourceIds: ["s1"] },
        { id: "e2", date: "2024-01-01", eventType: "remand", sourceIds: ["s1"] },
      ],
      sources: [tier1Verified],
    });
    expect(dashboard.hasConflictingSources).toBe(true);
  });
});
