import { useParams } from "react-router-dom";
import { useCase, useCaseClaims, useCaseEvents } from "./api";
import { usePoliticianSources } from "@/features/politicians/api";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { SourceList } from "@/components/sources/SourceList";
import { CaseTimeline } from "@/components/cases/CaseTimeline";
import { ClaimCard } from "@/components/evidence/ClaimCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ProfileHeaderSkeleton } from "@/components/feedback/Skeleton";
import { CASE_STAGE_LABELS } from "@/constants/legalStatus";
import { formatDate } from "@/lib/formatting/date";

export function CaseDetailPage() {
  const { caseId } = useParams();
  const { data: legalCase, isLoading, error } = useCase(caseId);
  const { data: claims = [] } = useCaseClaims(caseId);
  const { data: events = [] } = useCaseEvents(caseId);
  const sourceIds = [...(legalCase?.sourceIds ?? []), ...events.flatMap((e) => e.sourceIds)];
  const { data: sources = [] } = usePoliticianSources(sourceIds);

  if (isLoading) return <ProfileHeaderSkeleton />;
  if (error || !legalCase) {
    return (
      <ErrorState
        title="This case could not be found"
        description="It may not exist, or you may not have access to view it."
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="font-serif-report text-2xl font-semibold text-ink">{legalCase.caseName}</h1>
          <PublicationStatusBadge status={legalCase.publicationStatus} />
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          {legalCase.court || "Court unknown"}
          {legalCase.caseNumber ? ` · Case No. ${legalCase.caseNumber}` : ""} · {legalCase.jurisdiction || legalCase.country}
        </p>

        <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-ink-faint">Case type</dt>
            <dd className="mt-0.5 text-sm font-medium capitalize text-ink">{legalCase.caseType.replace("_", " ")}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Current stage</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{CASE_STAGE_LABELS[legalCase.legalStage]}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Date filed</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{legalCase.dateFiled ? formatDate(legalCase.dateFiled) : "Unknown"}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Next known step</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{legalCase.nextKnownStep || "Not recorded"}</dd>
          </div>
        </dl>
      </div>

      {legalCase.allegations && (
        <section>
          <h2 className="text-section-heading font-semibold text-ink">Allegations</h2>
          <p className="mt-1 text-xs text-ink-faint">Unproven claims — not findings of fact.</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{legalCase.allegations}</p>
        </section>
      )}

      {legalCase.charges && legalCase.charges.length > 0 && (
        <section>
          <h2 className="text-section-heading font-semibold text-ink">Charges</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink-muted">
            {legalCase.charges.map((charge) => (
              <li key={charge}>{charge}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-section-heading font-semibold text-ink">Current status</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{legalCase.currentStatus}</p>
        {legalCase.latestDevelopment && (
          <p className="mt-1 text-sm text-ink-faint">Latest development: {legalCase.latestDevelopment}</p>
        )}
      </section>

      <section>
        <h2 className="text-section-heading font-semibold text-ink">Case timeline</h2>
        <div className="mt-4">
          <CaseTimeline events={events} sources={sources} />
        </div>
      </section>

      <section>
        <h2 className="text-section-heading font-semibold text-ink">Fact vs allegation</h2>
        {claims.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No individually classified claims on file"
              description="Every claim tied to this case is reviewed and classified as fact, allegation, or claim before publication."
            />
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {claims.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                sourceCount={claim.sourceIds.length}
              />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-section-heading font-semibold text-ink">Sources</h2>
        <div className="mt-3">
          <SourceList sources={sources} />
        </div>
      </section>
    </div>
  );
}
