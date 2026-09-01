import { describe, expect, it } from "vitest";
import { deriveFreedomStatus } from "../freedomStatus";

const tier1Verified = { id: "s1", tier: 1 as const, verificationStatus: "verified" as const };
const tier4Unverified = { id: "s4", tier: 4 as const, verificationStatus: "unverified" as const };

describe("deriveFreedomStatus", () => {
  it("returns unknown/unresolved when there are no custody-relevant events", () => {
    const result = deriveFreedomStatus(
      [{ id: "e1", date: "2024-01-01", eventType: "investigation", sourceIds: ["s1"] }],
      [tier1Verified],
    );
    expect(result.status).toBe("unknown");
    expect(result.confidence).toBe("unresolved");
  });

  it("never infers imprisonment from an investigation, complaint, or indictment", () => {
    const result = deriveFreedomStatus(
      [
        { id: "e1", date: "2024-06-01", eventType: "complaint", sourceIds: ["s1"] },
        { id: "e2", date: "2024-07-01", eventType: "indictment", sourceIds: ["s1"] },
      ],
      [tier1Verified],
    );
    expect(result.status).not.toBe("incarcerated");
    expect(result.status).toBe("unknown");
  });

  it("uses the most recent custody event: release after arrest means free", () => {
    const result = deriveFreedomStatus(
      [
        { id: "e1", date: "2023-01-01", eventType: "arrest", sourceIds: ["s1"] },
        { id: "e2", date: "2023-06-01", eventType: "release", sourceIds: ["s1"] },
      ],
      [tier1Verified],
    );
    expect(result.status).toBe("free");
    expect(result.basedOnEventId).toBe("e2");
  });

  it("does not use a stale historical arrest as current status once bail is granted", () => {
    const result = deriveFreedomStatus(
      [
        { id: "e1", date: "2020-01-01", eventType: "arrest", sourceIds: ["s1"] },
        { id: "e2", date: "2021-01-01", eventType: "remand", sourceIds: ["s1"] },
        { id: "e3", date: "2022-01-01", eventType: "bail", sourceIds: ["s1"] },
      ],
      [tier1Verified],
    );
    expect(result.status).toBe("on_bail");
  });

  it("maps remand to incarcerated with high confidence on a verified tier-1 source", () => {
    const result = deriveFreedomStatus(
      [{ id: "e1", date: "2024-01-01", eventType: "remand", sourceIds: ["s1"] }],
      [tier1Verified],
    );
    expect(result.status).toBe("incarcerated");
    expect(result.confidence).toBe("high");
  });

  it("flags a conflict when two same-day events imply different statuses, rather than picking one", () => {
    const result = deriveFreedomStatus(
      [
        { id: "e1", date: "2024-01-01", eventType: "release", sourceIds: ["s1"] },
        { id: "e2", date: "2024-01-01", eventType: "remand", sourceIds: ["s1"] },
      ],
      [tier1Verified],
    );
    expect(result.hasConflict).toBe(true);
    expect(result.status).toBe("unknown");
    expect(result.confidence).toBe("unresolved");
  });

  it("flags a conflict when the backing source is marked disputed", () => {
    const result = deriveFreedomStatus(
      [{ id: "e1", date: "2024-01-01", eventType: "remand", sourceIds: ["s1"] }],
      [{ id: "s1", tier: 1, verificationStatus: "disputed" }],
    );
    expect(result.hasConflict).toBe(true);
    expect(result.status).toBe("unknown");
  });

  it("still resolves a status from a tier-4 source but at low confidence, never as sole proof of guilt elsewhere", () => {
    const result = deriveFreedomStatus(
      [{ id: "e1", date: "2024-01-01", eventType: "arrest", sourceIds: ["s4"] }],
      [tier4Unverified],
    );
    expect(result.status).toBe("detained");
    expect(result.confidence).toBe("low");
  });

  it("ignores events with no linked source", () => {
    const result = deriveFreedomStatus(
      [{ id: "e1", date: "2024-01-01", eventType: "arrest", sourceIds: [] }],
      [tier1Verified],
    );
    expect(result.status).toBe("unknown");
  });
});
