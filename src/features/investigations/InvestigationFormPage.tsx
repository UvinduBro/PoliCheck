import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateInvestigation } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { useSources } from "@/features/sources/api";
import type { Investigation } from "@/types";

function toCsv(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

interface FormValues {
  politicianIds: string[];
  agency: string;
  investigationType: Investigation["investigationType"];
  subject?: string;
  startDate?: string;
  currentStatus: Investigation["currentStatus"];
  description?: string;
  latestDevelopment?: string;
  sourceIds: string[];
}

export function InvestigationFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPoliticianId = searchParams.get("politicianId");
  const { user } = useAuth();
  const createMutation = useCreateInvestigation(user?.uid ?? "");
  const { data: sources = [] } = useSources();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: { investigationType: "corruption", currentStatus: "open", sourceIds: [] },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    if (values.sourceIds.length === 0) {
      setError("At least one source is required.");
      return;
    }
    try {
      const id = await createMutation.mutateAsync({ ...values, publicationStatus: "draft" });
      navigate(`/politicians/${values.politicianIds[0]}/investigations`);
      return id;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this investigation.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-page-heading font-semibold text-ink">Add an Investigation</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="politicianIds">Politician ID(s), comma-separated</label>
          <input
            id="politicianIds"
            className="input"
            defaultValue={preselectedPoliticianId ?? ""}
            {...register("politicianIds", { setValueAs: toCsv, required: true })}
          />
        </div>
        <div>
          <label className="label" htmlFor="agency">Investigating agency</label>
          <input id="agency" className="input" {...register("agency", { required: true })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="investigationType">Type</label>
            <select id="investigationType" className="input" {...register("investigationType")}>
              <option value="corruption">Corruption</option>
              <option value="financial">Financial</option>
              <option value="police">Police</option>
              <option value="tax">Tax</option>
              <option value="election">Election</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="currentStatus">Status</label>
            <select id="currentStatus" className="input" {...register("currentStatus")}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="referred">Referred</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="subject">Subject</label>
          <input id="subject" className="input" {...register("subject")} />
        </div>
        <div>
          <label className="label" htmlFor="startDate">Start date</label>
          <input id="startDate" className="input" placeholder="YYYY-MM-DD" {...register("startDate")} />
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" rows={3} className="input" {...register("description")} />
        </div>
        <div>
          <label className="label" htmlFor="latestDevelopment">Latest development</label>
          <textarea id="latestDevelopment" rows={2} className="input" {...register("latestDevelopment")} />
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
        </fieldset>
        {error && <p role="alert" className="text-sm text-status-critical">{error}</p>}
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save investigation"}
        </button>
      </form>
    </div>
  );
}
