import { describe, expect, it } from "vitest";
import { findDistinguishingConflicts, matchIdentityCandidates } from "../identityMatch";

describe("identity matching", () => {
  it("reports an exact match on identical full names", () => {
    const a = { fullName: "Jane Doe", alternativeNames: [], localLanguageNames: [], nicknames: [] };
    const b = { fullName: "jane doe", alternativeNames: [], localLanguageNames: [], nicknames: [] };
    expect(matchIdentityCandidates(a, b)).toBe("exact");
  });

  it("reports a partial match via an alternative/nickname overlap", () => {
    const a = { fullName: "Jane Doe", alternativeNames: [], localLanguageNames: [], nicknames: ["JD"] };
    const b = { fullName: "Janet Doe", alternativeNames: ["JD"], localLanguageNames: [], nicknames: [] };
    expect(matchIdentityCandidates(a, b)).toBe("partial");
  });

  it("reports no match when names are unrelated", () => {
    const a = { fullName: "Jane Doe", alternativeNames: [], localLanguageNames: [], nicknames: [] };
    const b = { fullName: "John Smith", alternativeNames: [], localLanguageNames: [], nicknames: [] };
    expect(matchIdentityCandidates(a, b)).toBe("none");
  });

  it("surfaces distinguishing conflicts even for a name match, so callers never auto-merge", () => {
    const a = { country: "Sri Lanka", dateOfBirth: "1970-01-01", politicalParty: "", constituency: "" };
    const b = { country: "India", dateOfBirth: "1970-01-01", politicalParty: "", constituency: "" };
    expect(findDistinguishingConflicts(a, b)).toEqual(["country"]);
  });

  it("returns no conflicts when distinguishing fields agree or are unset", () => {
    const a = { country: "Sri Lanka", dateOfBirth: "", politicalParty: "", constituency: "" };
    const b = { country: "Sri Lanka", dateOfBirth: "", politicalParty: "", constituency: "" };
    expect(findDistinguishingConflicts(a, b)).toEqual([]);
  });
});
