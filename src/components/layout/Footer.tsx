import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BrandMark } from "./BrandMark";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2 text-ink">
          <BrandMark size={16} className="text-accent" />
          <span className="text-sm font-semibold tracking-tight">{t("app.name")}</span>
          <span className="text-sm text-ink-faint">{t("app.tagline")}</span>
        </div>

        <div className="mt-5 space-y-3 text-sm text-ink-muted">
          <p className="flex items-start gap-2 font-medium text-ink">
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-status-pending" aria-hidden="true" />
            {t("footer.allegationsWarning")}
          </p>
          <p className="max-w-3xl">{t("footer.description")}</p>
          <p className="max-w-3xl">{t("footer.reportErrorNote")}</p>
        </div>

        <p className="mt-6 border-t border-line pt-5 text-xs text-ink-faint">
          {t("footer.copyright", { year: new Date().getFullYear() })} ·{" "}
          <Link to="/disclaimer" className="text-accent hover:underline">
            {t("footer.disclaimerLink")}
          </Link>
        </p>
      </div>
    </footer>
  );
}
