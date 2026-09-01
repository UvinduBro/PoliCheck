import type { FreedomStatus, LegalEvent, Source } from "@/types";

/**
 * Event types that bear directly on whether someone is currently free.
 * Deliberately excludes "complaint", "investigation", "indictment", "hearing" and
 * "judgment": per spec section 16, an investigation, indictment, or complaint must
 * never be treated as evidence of custody status.
 */
const CUSTODY_EVENT_TYPES = new Set<LegalEvent["eventType"]>([
  "arrest",
  "detention",
  "remand",
  "bail",
  "release",
]);

const CUSTODY_STATUS_BY_EVENT: Record<string, FreedomStatus> = {
  arrest: "detained",
  detention: "detained",
  remand: "incarcerated",
  bail: "on_bail",
  release: "free",
};

type FreedomEvent = Pick<LegalEvent, "id" | "date" | "eventType" | "sourceIds">;
type FreedomSource = Pick<Source, "id" | "tier" | "verificationStatus">;

export interface FreedomStatusResult {
  status: FreedomStatus;
  confidence: "high" | "medium" | "low" | "unresolved";
  basedOnEventId?: string;
  hasConflict: boolean;
  conflictingEventIds: string[];
}

function bestSourceFor(event: FreedomEvent, sources: FreedomSource[]): FreedomSource | undefined {
  const linked = sources.filter((s) => event.sourceIds.includes(s.id));
  if (linked.length === 0) return undefined;
  // Prefer the lowest (most authoritative) tier; tier 4 is never treated as authoritative for custody status.
  const eligible = linked.filter((s) => s.tier <= 3);
  const pool = eligible.length > 0 ? eligible : linked;
  return [...pool].sort((a, b) => a.tier - b.tier)[0];
}

/**
 * Determines current freedom status from the single most recent custody-relevant
 * legal event, per spec section 13: "Current freedom status must be based on the
 * most recent reliable source." Never infers imprisonment from a stale event, a
 * complaint, an investigation, an indictment, a political statement, or a
 * historical arrest that was later superseded.
 */
export function deriveFreedomStatus(
  events: FreedomEvent[],
  sources: FreedomSource[],
): FreedomStatusResult {
  const qualifying = events
    .filter((e) => CUSTODY_EVENT_TYPES.has(e.eventType))
    .filter((e) => bestSourceFor(e, sources) !== undefined)
    .filter((e) => !Number.isNaN(Date.parse(e.date)))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  if (qualifying.length === 0) {
    return { status: "unknown", confidence: "unresolved", hasConflict: false, conflictingEventIds: [] };
  }

  const [latest, ...rest] = qualifying;
  const latestTime = Date.parse(latest.date);
  const latestStatus = CUSTODY_STATUS_BY_EVENT[latest.eventType];

  // A conflict is a same-day event implying a different status, or any linked
  // source explicitly marked disputed — both require reviewer confirmation
  // rather than an automatic status.
  const conflictingEventIds = rest
    .filter((e) => Date.parse(e.date) === latestTime)
    .filter((e) => CUSTODY_STATUS_BY_EVENT[e.eventType] !== latestStatus)
    .map((e) => e.id);

  const latestSource = bestSourceFor(latest, sources);
  const disputed = latestSource?.verificationStatus === "disputed";
  const hasConflict = conflictingEventIds.length > 0 || disputed;

  if (hasConflict) {
    return {
      status: "unknown",
      confidence: "unresolved",
      basedOnEventId: latest.id,
      hasConflict: true,
      conflictingEventIds,
    };
  }

  let confidence: FreedomStatusResult["confidence"] = "low";
  if (latestSource?.tier === 1 && latestSource.verificationStatus === "verified") {
    confidence = "high";
  } else if (latestSource && latestSource.tier <= 2 && latestSource.verificationStatus !== "unverified") {
    confidence = "medium";
  }

  return {
    status: latestStatus,
    confidence,
    basedOnEventId: latest.id,
    hasConflict: false,
    conflictingEventIds: [],
  };
}
