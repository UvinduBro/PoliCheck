import { differenceInCalendarDays, parseISO } from "date-fns";
import { Lock, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/formatting/date";
import type { Politician } from "@/types";

function daysSince(dateStr: string): number {
  return Math.max(0, differenceInCalendarDays(new Date(), parseISO(dateStr)));
}

export function CustodyStatusCard({ politician }: { politician: Politician }) {
  const { t } = useTranslation();
  const { custodyStatus, custodySince, bailedSince, sentenceYears } = politician;
  if (!custodySince || (custodyStatus !== "jailed" && custodyStatus !== "bailed")) return null;

  if (custodyStatus === "jailed") {
    const days = daysSince(custodySince);
    return (
      <section className="card mt-6 overflow-hidden border-status-critical/25">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-status-critical-bg/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-critical-bg text-status-critical">
              <Lock size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-status-critical">{t("custody.jailedSince")}</p>
              <p className="text-lg font-semibold text-ink">{formatDate(custodySince)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums text-status-critical">{days.toLocaleString()}</p>
            <p className="text-xs text-ink-faint">{t("custody.daysInCustody", { count: days })}</p>
          </div>
        </div>
        {sentenceYears !== undefined && (
          <p className="px-6 py-2.5 text-xs text-ink-muted">
            {t("custody.sentenceOnRecord", { count: sentenceYears })}
          </p>
        )}
      </section>
    );
  }

  const daysServed = bailedSince ? Math.max(0, differenceInCalendarDays(parseISO(bailedSince), parseISO(custodySince))) : null;

  return (
    <section className="card mt-6 border-status-pending/25 p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-status-pending">{t("custody.timelineHeading")}</p>

      <div className="mt-4 flex items-start gap-3">
        <div className="flex flex-col items-center">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-critical-bg text-status-critical">
            <Lock size={14} aria-hidden="true" />
          </span>
          <span className="mt-1 h-9 w-px bg-line" aria-hidden="true" />
        </div>
        <div className="pb-3">
          <p className="text-sm font-medium text-ink">{t("custody.jailed")}</p>
          <p className="text-xs text-ink-faint">{formatDate(custodySince)}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-pending-bg text-status-pending">
          <Scale size={14} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">{t("custody.releasedOnBail")}</p>
          <p className="text-xs text-ink-faint">{bailedSince ? formatDate(bailedSince) : t("custody.dateNotRecorded")}</p>
        </div>
      </div>

      {daysServed !== null && (
        <p className="mt-3 text-xs text-ink-muted">
          {daysServed.toLocaleString()} {t("custody.daysServedBeforeBail", { count: daysServed })}
        </p>
      )}
      {sentenceYears !== undefined && (
        <p className="mt-1 text-xs text-ink-muted">
          {t("custody.sentenceOnRecord", { count: sentenceYears })}
        </p>
      )}
    </section>
  );
}
