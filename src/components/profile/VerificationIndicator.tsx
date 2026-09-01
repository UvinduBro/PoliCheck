import { BadgeCheck, CircleAlert, ShieldQuestion } from "lucide-react";
import type { IdentityConfidence } from "@/types";

const CONFIG: Record<IdentityConfidence, { label: string; icon: typeof BadgeCheck; className: string }> = {
  high: { label: "Identity verified", icon: BadgeCheck, className: "text-status-verified" },
  medium: { label: "Identity partially verified", icon: CircleAlert, className: "text-status-pending" },
  low: { label: "Low identity confidence", icon: CircleAlert, className: "text-status-pending" },
  unresolved: { label: "Identity unresolved", icon: ShieldQuestion, className: "text-status-critical" },
};

export function VerificationIndicator({ confidence }: { confidence: IdentityConfidence }) {
  const { label, icon: Icon, className } = CONFIG[confidence];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${className}`}>
      <Icon size={15} aria-hidden="true" />
      {label}
    </span>
  );
}
