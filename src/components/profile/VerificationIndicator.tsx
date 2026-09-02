import { BadgeCheck, CircleAlert, ShieldQuestion } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IdentityConfidence } from "@/types";

const CONFIG: Record<IdentityConfidence, { key: string; icon: typeof BadgeCheck; className: string }> = {
  high: { key: "profile.identityVerified", icon: BadgeCheck, className: "text-status-verified" },
  medium: { key: "profile.identityPartiallyVerified", icon: CircleAlert, className: "text-status-pending" },
  low: { key: "profile.identityLowConfidence", icon: CircleAlert, className: "text-status-pending" },
  unresolved: { key: "profile.identityUnresolved", icon: ShieldQuestion, className: "text-status-critical" },
};

export function VerificationIndicator({ confidence }: { confidence: IdentityConfidence }) {
  const { t } = useTranslation();
  const { key, icon: Icon, className } = CONFIG[confidence];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${className}`}>
      <Icon size={15} aria-hidden="true" />
      {t(key)}
    </span>
  );
}
