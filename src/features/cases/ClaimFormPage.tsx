import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSources } from "@/features/sources/api";
import { useFeatureFlags } from "@/features/settings/api";
import { useCase } from "./api";
import { COLLECTIONS, createDoc } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import { claimSchema, type ClaimFormValues } from "@/lib/validation/schemas";
import { CLAIM_CLASSIFICATION_LABELS } from "@/constants/legalStatus";
import { isClaimClassificationConsistentWithStage } from "@/lib/legal-status/caseStage";
import { isSourceTierSufficientForClassification } from "@/lib/legal-status/sourceTier";
import type { Claim } from "@/types";

function toLines(value: string): string[] {
  return value.split("\n").map((v) => v.trim()).filter(Boolean);
}

function useCreateClaim(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Claim, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
      const id = await createDoc(COLLECTIONS.claims, { ...data, createdBy: actorId });
      await writeAuditLog({ actorId, action: "create", entityType: "claim", entityId: id, after: data });
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["claims"] }),
  });
}

const CLASSIFICATIONS = Object.keys(CLAIM_CLASSIFICATION_LABELS) as ClaimFormValues["classification"][];

export function ClaimFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPoliticianId = searchParams.get("politicianId") ?? "";
  const preselectedCaseId = searchParams.get("caseId") ?? "";
  const { user } = useAuth();
  const { data: relatedCase } = useCase(preselectedCaseId || undefined);
  const createMutation = useCreateClaim(user?.uid ?? "");
  const { flags } = useFeatureFlags();
  const { data: sources = [] } = useSources();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      politicianId: preselectedPoliticianId,
      caseId: preselectedCaseId,
      classification: "unverified_claim",
      confidence: "low",
      sourceIds: [],
      sourceLinks: [],
    },
  });

  const classification = watch("classification");
  const selectedSourceIds = watch("sourceIds") ?? [];
  const stageMismatch = !isClaimClassificationConsistentWithStage(classification, relatedCase?.legalStage);
  const insufficientTierSources = sources.filter(
    (s) => selectedSourceIds.includes(s.id) && !isSourceTierSufficientForClassification(s.tier, classification),
  );

  async function onSubmit(values: ClaimFormValues) {
    setError(null);
    if (stageMismatch) {
      setError(
        `This case's legal stage ("${relatedCase?.legalStage}") does not support a "${CLAIM_CLASSIFICATION_LABELS[classification]}" classification. An indictment or investigation is never a conviction.`,
      );
      return;
    }
    if (insufficientTierSources.length > 0) {
      setError(
        `Tier 4 sources cannot back a "${CLAIM_CLASSIFICATION_LABELS[classification]}" claim: ${insufficientTierSources.map((s) => s.title).join(", ")}`,
      );
      return;
    }
    try {
      const id = await createMutation.mutateAsync({ ...values, reviewStatus: "pending_review" });
      navigate(values.caseId ? `/cases/${values.caseId}` : `/politicians/${values.politicianId}/report`);
      return id;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this claim.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-page-heading font-semibold text-ink">Add a Claim</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Every claim is classified — verified fact, court finding, formal allegation, investigation, media
        report, or political claim — so readers never mistake an accusation for a conviction.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="politicianId">Politician ID</label>
            <input id="politicianId" className="input" {...register("politicianId")} />
          </div>
          <div>
            <label className="label" htmlFor="caseId">Related case ID (optional)</label>
            <input id="caseId" className="input" {...register("caseId")} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="text">Claim text</label>
          <textarea id="text" rows={3} className="input" {...register("text")} />
          {errors.text && <p className="mt-1 text-sm text-status-critical">{errors.text.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="classification">Classification</label>
            <select id="classification" className="input" {...register("classification")}>
              {CLASSIFICATIONS.map((c) => <option key={c} value={c}>{CLAIM_CLASSIFICATION_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="confidence">Confidence</label>
            <select id="confidence" className="input" {...register("confidence")}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        {stageMismatch && relatedCase && (
          <p className="text-sm text-status-pending">
            Warning: case stage is "{relatedCase.legalStage}", which does not support this classification.
          </p>
        )}
        <div>
          <label className="label" htmlFor="claimant">Claimant (who made this claim)</label>
          <input id="claimant" className="input" {...register("claimant")} />
        </div>
        <div>
          <label className="label" htmlFor="response">Response / rebuttal, if any</label>
          <textarea id="response" rows={2} className="input" {...register("response")} />
        </div>
        <div>
          <label className="label" htmlFor="currentStatus">Current status</label>
          <input id="currentStatus" className="input" {...register("currentStatus")} />
        </div>
        {flags.sources ? (
          <fieldset>
            <legend className="label">Sources (at least one required)</legend>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-line p-2">
              {sources.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={s.id} {...register("sourceIds")} />
                  {s.title} <span className="text-xs text-ink-faint">(Tier {s.tier})</span>
                </label>
              ))}
            </div>
            {errors.sourceLinks && <p className="mt-1 text-sm text-status-critical">{errors.sourceLinks.message}</p>}
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
          {isSubmitting ? "Saving..." : "Save claim for review"}
        </button>
      </form>
    </div>
  );
}
