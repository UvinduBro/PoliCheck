import { AlertTriangle, Ban, CheckCircle2, Gavel, HelpCircle, Lock, Scale, Search } from "lucide-react";
import { STATUS_BADGE_CLASSES, STATUS_BADGE_LABELS, type StatusBadgeKey } from "@/constants/legalStatus";

const ICONS: Record<StatusBadgeKey, typeof CheckCircle2> = {
  VERIFIED: CheckCircle2,
  ALLEGATION: AlertTriangle,
  UNDER_INVESTIGATION: Search,
  CASE_PENDING: Scale,
  CONVICTED: Gavel,
  ACQUITTED: Ban,
  INCARCERATED: Lock,
  UNKNOWN: HelpCircle,
};

/**
 * Status labels always pair color with text + icon (never color alone) per the
 * accessibility requirement in spec section 22. Never render this without a
 * `sourceCount` > 0 upstream — spec section 9: "Do not display a status label
 * without supporting sources."
 */
export function StatusBadge({ status, className = "" }: { status: StatusBadgeKey; className?: string }) {
  const Icon = ICONS[status];
  return (
    <span className={`chip ${STATUS_BADGE_CLASSES[status]} ${className}`}>
      <Icon aria-hidden="true" size={14} />
      {STATUS_BADGE_LABELS[status]}
    </span>
  );
}
