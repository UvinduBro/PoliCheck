import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSources } from "@/features/sources/api";
import { COLLECTIONS, createDoc } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import { legalEventSchema, type LegalEventFormValues } from "@/lib/validation/schemas";
import type { LegalEvent } from "@/types";

const EVENT_TYPES: LegalEvent["eventType"][] = [
  "complaint", "investigation", "arrest", "detention", "remand", "bail", "indictment",
  "hearing", "judgment", "conviction", "acquittal", "dismissal", "appeal", "release",
  "warrant", "travel_restriction", "other",
];

function toCsv(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

function useCreateLegalEvent(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<LegalEvent, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
      const id = await createDoc(COLLECTIONS.legalEvents, { ...data, createdBy: actorId });
      await writeAuditLog({ actorId, action: "create", entityType: "legalEvent", entityId: id, after: data });
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["legalEvents"] }),
  });
}

export function LegalEventFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPoliticianId = searchParams.get("politicianId");
  const { user } = useAuth();
  const createMutation = useCreateLegalEvent(user?.uid ?? "");
  const { data: sources = [] } = useSources();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LegalEventFormValues>({
    resolver: zodResolver(legalEventSchema),
    defaultValues: { eventType: "hearing", sourceIds: [] },
  });

  async function onSubmit(values: LegalEventFormValues) {
    setError(null);
    try {
      const id = await createMutation.mutateAsync({ ...values, publicationStatus: "draft" });
      navigate(`/politicians/${values.politicianIds[0]}/timeline`);
      return id;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this event.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-page-heading font-semibold text-ink">Add a Legal Timeline Event</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="politicianIds">Politician ID(s), comma-separated</label>
          <input
            id="politicianIds"
            className="input"
            defaultValue={preselectedPoliticianId ?? ""}
            {...register("politicianIds", { setValueAs: toCsv })}
          />
        </div>
        <div>
          <label className="label" htmlFor="caseId">Related case ID (optional)</label>
          <input id="caseId" className="input" {...register("caseId")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="date">Date</label>
            <input id="date" className="input" placeholder="YYYY-MM-DD" {...register("date")} />
            {errors.date && <p className="mt-1 text-sm text-status-critical">{errors.date.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="eventType">Event type</label>
            <select id="eventType" className="input" {...register("eventType")}>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input id="title" className="input" {...register("title")} />
          {errors.title && <p className="mt-1 text-sm text-status-critical">{errors.title.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" rows={3} className="input" {...register("description")} />
          {errors.description && <p className="mt-1 text-sm text-status-critical">{errors.description.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="legalSignificance">Legal significance</label>
          <textarea id="legalSignificance" rows={2} className="input" {...register("legalSignificance")} />
        </div>
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
          {errors.sourceIds && <p className="mt-1 text-sm text-status-critical">{errors.sourceIds.message}</p>}
        </fieldset>
        {error && <p role="alert" className="text-sm text-status-critical">{error}</p>}
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save event"}
        </button>
      </form>
    </div>
  );
}
