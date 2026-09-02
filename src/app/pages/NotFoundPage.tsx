import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-semibold text-ink">{t("notFound.title")}</h1>
      <p className="mt-2 text-sm text-ink-muted">{t("notFound.description")}</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">{t("notFound.backHome")}</Link>
    </div>
  );
}
