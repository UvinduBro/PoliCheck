import { BookOpenCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SOURCE_TIER_LABELS } from "@/constants/sourceTiers";

export function DisclaimerPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-page-heading font-semibold text-ink">{t("disclaimer.title")}</h1>
      <p className="mt-1 text-sm text-ink-muted">{t("disclaimer.subtitle")}</p>

      <section className="mt-8 rounded-lg border border-status-pending/25 bg-status-pending-bg p-5">
        <h2 className="flex items-center gap-2 font-semibold text-status-pending">
          <ShieldAlert size={18} aria-hidden="true" />
          {t("disclaimer.allegationsHeading")}
        </h2>
        <p className="mt-2 text-sm text-ink">{t("disclaimer.allegationsBody")}</p>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-section-heading font-semibold text-ink">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-accent">
            <ShieldCheck size={18} aria-hidden="true" />
          </span>
          {t("disclaimer.methodologyHeading")}
        </h2>
        <p className="mt-3 text-sm text-ink-muted">{t("disclaimer.methodologyBody")}</p>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-section-heading font-semibold text-ink">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-accent">
            <BookOpenCheck size={18} aria-hidden="true" />
          </span>
          {t("disclaimer.sourceQualityHeading")}
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
          {([1, 2, 3, 4] as const).map((tier) => (
            <li key={tier} className="flex items-baseline gap-2">
              <span className="font-medium text-ink">Tier {tier}</span>
              <span>{SOURCE_TIER_LABELS[tier].replace(/^Tier \d: /, "")}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-faint">{t("disclaimer.sourceQualityFoonote")}</p>
      </section>
    </div>
  );
}
