import type { Politician } from "@/types";

function normalize(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function allNames(p: Pick<Politician, "fullName" | "alternativeNames" | "localLanguageNames" | "nicknames">): string[] {
  return [p.fullName, ...p.alternativeNames, ...p.localLanguageNames, ...p.nicknames].filter(Boolean);
}

export type IdentityMatchStrength = "exact" | "partial" | "none";

/**
 * Compares two identity candidates by name overlap only. Per spec section 16
 * ("never merge similarly named politicians") this NEVER returns a recommendation
 * to merge — it only flags that a human should check distinguishing details
 * (country, DOB, party, constituency) before treating them as the same person.
 */
export function matchIdentityCandidates(
  a: Pick<Politician, "fullName" | "alternativeNames" | "localLanguageNames" | "nicknames">,
  b: Pick<Politician, "fullName" | "alternativeNames" | "localLanguageNames" | "nicknames">,
): IdentityMatchStrength {
  const namesA = new Set(allNames(a).map(normalize));
  const namesB = new Set(allNames(b).map(normalize));

  if (normalize(a.fullName) === normalize(b.fullName)) return "exact";
  for (const name of namesA) {
    if (namesB.has(name)) return "partial";
  }
  return "none";
}

/**
 * Distinguishing fields that should be compared before any two candidates are
 * treated as the same person. Returns the fields that disagree — a non-empty
 * result is a reason to keep the candidates separate or mark identity "unresolved".
 */
export function findDistinguishingConflicts(
  a: Pick<Politician, "country" | "dateOfBirth" | "politicalParty" | "constituency">,
  b: Pick<Politician, "country" | "dateOfBirth" | "politicalParty" | "constituency">,
): string[] {
  const conflicts: string[] = [];
  if (a.country && b.country && a.country !== b.country) conflicts.push("country");
  if (a.dateOfBirth && b.dateOfBirth && a.dateOfBirth !== b.dateOfBirth) conflicts.push("dateOfBirth");
  if (a.politicalParty && b.politicalParty && a.politicalParty !== b.politicalParty) {
    conflicts.push("politicalParty");
  }
  if (a.constituency && b.constituency && a.constituency !== b.constituency) {
    conflicts.push("constituency");
  }
  return conflicts;
}
