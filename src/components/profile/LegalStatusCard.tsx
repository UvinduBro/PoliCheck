import { ArrowRight, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FreedomStatusBadge } from "@/components/status/FreedomStatusBadge";
import { ConfidenceBadge } from "@/components/status/ConfidenceBadge";
import { formatDate } from "@/lib/formatting/date";
import type { FreedomStatus } from "@/types";
import type { Timestamp } from "firebase/firestore";

export function LegalStatusCard({
  status,
  confidence,
  lastVerified,
  hasConflict,
  evidenceHref,
  custodySince,
  sentenceYears,
  custodySourceLink,
}: {
  status: FreedomStatus;
  confidence: "high" | "medium" | "low" | "unresolved";
  lastVerified?: string | Timestamp;
  hasConflict?: boolean;
  evidenceHref: string;
  custodySince?: string;
  sentenceYears?: number;
  custodySourceLink?: string;
}) {
  const { t } = useTranslation();

  return (
    <section className="card overflow-hidden">
      <div className="border-b border-line bg-surface-2/40 px-6 py-3">
        <p className="eyebrow">{t("legalStatus.heading")}</p>
      </div>
      <div className="px-6 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <FreedomStatusBadge status={status} className="px-3 py-1.5 text-sm" />
        </div>
        <p className="mt-3 text-xl font-medium leading-snug text-ink sm:text-2xl">
          {t(`legalStatus.statement.${status}`)}
        </p>

        {hasConflict && (
          <p className="mt-3 rounded-md bg-status-pending-bg px-3 py-2 text-sm text-status-pending">
            {t("legalStatus.sourcesDisagree")}
          </p>
        )}

        {(status === "incarcerated" || status === "on_bail") && (custodySince || sentenceYears !== undefined || custodySourceLink) && (
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 rounded-md border border-line bg-surface-2/40 px-4 py-3 text-sm sm:grid-cols-3">
            {custodySince && (
              <div>
                <dt className="text-xs text-ink-faint">{t("legalStatus.jailedSince")}</dt>
                <dd className="mt-0.5 font-medium text-ink">{formatDate(custodySince)}</dd>
              </div>
            )}
            {sentenceYears !== undefined && (
              <div>
                <dt className="text-xs text-ink-faint">{t("legalStatus.sentence")}</dt>
                <dd className="mt-0.5 font-medium text-ink">{t("legalStatus.sentenceYears", { count: sentenceYears })}</dd>
              </div>
            )}
            {custodySourceLink && (
              <div>
                <dt className="text-xs text-ink-faint">{t("legalStatus.source")}</dt>
                <dd className="mt-0.5">
                  <a
                    href={custodySourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                  >
                    {t("legalStatus.viewSource")} <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
          <span>
            {t("legalStatus.lastVerified")}{" "}
            <span className="font-medium text-ink">
              {lastVerified ? formatDate(lastVerified) : t("legalStatus.notYetVerified")}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            {t("legalStatus.sourceConfidence")} <ConfidenceBadge level={confidence} />
          </span>
        </div>

        <Link
          to={evidenceHref}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          {t("legalStatus.viewEvidence")}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
