import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateCase } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { legalCaseSchema, type LegalCaseFormValues } from "@/lib/validation/schemas";
import { CASE_STAGE_LABELS } from "@/constants/legalStatus";
import { isTierConsistentWithSourceType } from "@/lib/legal-status/sourceTier";
import { useSources } from "@/features/sources/api";
import { useFeatureFlags } from "@/features/settings/api";

function toCsv(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

function toLines(value: string): string[] {
  return value.split("\n").map((v) => v.trim()).filter(Boolean);
}

const CASE_TYPES: LegalCaseFormValues["caseType"][] = [
  "criminal", "civil", "constitutional", "fundamental_rights", "administrative", "election", "corruption", "financial", "other",
];
const STAGES = Object.keys(CASE_STAGE_LABELS) as LegalCaseFormValues["legalStage"][];

export function CaseFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPoliticianId = searchParams.get("politicianId");
  const { user } = useAuth();
  const createMutation = useCreateCase(user?.uid ?? "");
  const { flags } = useFeatureFlags();
  const { data: sources = [] } = useSources();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LegalCaseFormValues>({
    resolver: zodResolver(legalCaseSchema),
    defaultValues: {
      legalStage: "allegation_only",
      caseType: "criminal",
      sourceIds: [],
      sourceLinks: [],
      charges: [],
    },
  });

  const selectedSourceIds = watch("sourceIds") ?? [];
  const inconsistentTierSources = sources.filter(
    (s) => selectedSourceIds.includes(s.id) && !isTierConsistentWithSourceType(s.tier, s.sourceType),
  );

  async function onSubmit(values: LegalCaseFormValues) {
    setError(null);
    try {
      const id = await createMutation.mutateAsync({ ...values, parties: [], publicationStatus: "draft" });
      navigate(`/cases/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this case.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-page-heading font-semibold text-ink">Add a Legal Case</h1>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="politicianIds">Politician ID(s), comma-separated</label>
          <input id="politicianIds" className="input" {...register("politicianIds", { setValueAs: toCsv })} defaultValue={preselectedPoliticianId ?? ""} />
          {errors.politicianIds && <p className="mt-1 text-sm text-status-critical">{errors.politicianIds.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="caseName">Case name</label>
          <input id="caseName" className="input" {...register("caseName")} />
          {errors.caseName && <p className="mt-1 text-sm text-status-critical">{errors.caseName.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="caseNumber">Case number</label>
            <input id="caseNumber" className="input" {...register("caseNumber")} />
          </div>
          <div>
            <label className="label" htmlFor="court">Court</label>
            <input id="court" className="input" {...register("court")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="jurisdiction">Jurisdiction</label>
            <input id="jurisdiction" className="input" {...register("jurisdiction")} />
          </div>
          <div>
            <label className="label" htmlFor="country">Country</label>
            <input id="country" className="input" {...register("country")} />
            {errors.country && <p className="mt-1 text-sm text-status-critical">{errors.country.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="caseType">Case type</label>
            <select id="caseType" className="input" {...register("caseType")}>
              {CASE_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="legalStage">Current legal stage</label>
            <select id="legalStage" className="input" {...register("legalStage")}>
              {STAGES.map((s) => <option key={s} value={s}>{CASE_STAGE_LABELS[s]}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="dateFiled">Date filed</label>
          <input id="dateFiled" className="input" placeholder="YYYY-MM-DD" {...register("dateFiled")} />
        </div>

        <div>
          <label className="label" htmlFor="allegations">Allegations (describe neutrally — this is a claim, not a fact)</label>
          <textarea id="allegations" rows={3} className="input" {...register("allegations")} />
        </div>

        <div>
          <label className="label" htmlFor="charges">Charges, comma-separated</label>
          <input id="charges" className="input" {...register("charges", { setValueAs: toCsv })} />
        </div>

        <div>
          <label className="label" htmlFor="currentStatus">Current status summary</label>
          <textarea id="currentStatus" rows={2} className="input" {...register("currentStatus")} />
          {errors.currentStatus && <p className="mt-1 text-sm text-status-critical">{errors.currentStatus.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="latestDevelopment">Latest development</label>
          <textarea id="latestDevelopment" rows={2} className="input" {...register("latestDevelopment")} />
        </div>

        <div>
          <label className="label" htmlFor="nextKnownStep">Next known step</label>
          <input id="nextKnownStep" className="input" {...register("nextKnownStep")} />
        </div>

        {flags.sources ? (
          <fieldset>
            <legend className="label">Sources (at least one required)</legend>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-line p-2">
              {sources.length === 0 && <p className="text-sm text-ink-muted">No sources exist yet — add one first.</p>}
              {sources.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={s.id} {...register("sourceIds")} />
                  {s.title} <span className="text-xs text-ink-faint">(Tier {s.tier})</span>
                </label>
              ))}
            </div>
            {errors.sourceLinks && <p className="mt-1 text-sm text-status-critical">{errors.sourceLinks.message}</p>}
            {inconsistentTierSources.length > 0 && (
              <p className="mt-1 text-sm text-status-pending">
                Check the tier on: {inconsistentTierSources.map((s) => s.title).join(", ")} — its source type
                usually implies a different tier.
              </p>
            )}
          </fieldset>
        ) : (
          <div>
            <label className="label" htmlFor="sourceLinks">Source link(s) — one per line (at least one required)</label>
            <textarea
              id="sourceLinks"
              rows={3}
              className="input"
              placeholder="https://…"
              {...register("sourceLinks", { setValueAs: toLines })}
            />
            {errors.sourceLinks && <p className="mt-1 text-sm text-status-critical">{errors.sourceLinks.message}</p>}
          </div>
        )}

        {error && <p role="alert" className="text-sm text-status-critical">{error}</p>}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save case"}
        </button>
      </form>
    </div>
  );
}
