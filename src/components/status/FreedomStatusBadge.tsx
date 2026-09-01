import { StatusBadge } from "./StatusBadge";
import type { StatusBadgeKey } from "@/constants/legalStatus";
import type { FreedomStatus } from "@/types";

const FREEDOM_TO_BADGE: Record<FreedomStatus, StatusBadgeKey> = {
  free: "VERIFIED",
  incarcerated: "INCARCERATED",
  detained: "INCARCERATED",
  on_bail: "CASE_PENDING",
  wanted: "ALLEGATION",
  travel_restricted: "CASE_PENDING",
  unknown: "UNKNOWN",
};

export function FreedomStatusBadge({ status, className }: { status: FreedomStatus; className?: string }) {
  return <StatusBadge status={FREEDOM_TO_BADGE[status]} className={className} />;
}
