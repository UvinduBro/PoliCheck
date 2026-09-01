import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCreatePolitician, usePolitician, useUpdatePolitician } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { politicianSchema, type PoliticianFormValues } from "@/lib/validation/schemas";

function toCsv(value: string): string[] {
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

export function PoliticianFormPage() {
  const { politicianId } = useParams();
  const isEditing = Boolean(politicianId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: existing } = usePolitician(politicianId);
  const createMutation = useCreatePolitician(user?.uid ?? "");
  const updateMutation = useUpdatePolitician(user?.uid ?? "");
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PoliticianFormValues>({
    resolver: zodResolver(politicianSchema),
    values: existing
      ? {
          fullName: existing.fullName,
          alternativeNames: existing.alternativeNames,
          localLanguageNames: existing.localLanguageNames,
          nicknames: existing.nicknames,
          country: existing.country,
          nationality: existing.nationality,
          dateOfBirth: existing.dateOfBirth,
          placeOfBirth: existing.placeOfBirth,
          profession: existing.profession,
          education: existing.education ?? [],
          politicalParty: existing.politicalParty,
          currentPosition: existing.currentPosition,
          constituency: existing.constituency,
          biography: existing.biography,
          identityConfidence: existing.identityConfidence,
        }
      : undefined,
  });

  async function onSubmit(values: PoliticianFormValues) {
    setError(null);
    try {
      if (isEditing && politicianId) {
        await updateMutation.mutateAsync({ id: politicianId, data: values });
        navigate(`/politicians/${politicianId}/overview`);
      } else {
        const id = await createMutation.mutateAsync({
          ...values,
          publicationStatus: "draft",
        });
        navigate(`/politicians/${id}/overview`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this profile.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
        {isEditing ? "Edit Politician Profile" : "Add a New Politician"}
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Verify identity carefully before adding legal records. If multiple people share this name, create
        separate profiles rather than merging them.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="fullName">Full legal name</label>
          <input id="fullName" className="input" {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-sm text-red-700">{errors.fullName.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="alternativeNames">Alternative names (comma-separated)</label>
            <input
              id="alternativeNames"
              className="input"
              {...register("alternativeNames", { setValueAs: toCsv })}
            />
          </div>
          <div>
            <label className="label" htmlFor="localLanguageNames">Local-language names (comma-separated)</label>
            <input
              id="localLanguageNames"
              className="input"
              {...register("localLanguageNames", { setValueAs: toCsv })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="country">Country</label>
            <input id="country" className="input" {...register("country")} />
            {errors.country && <p className="mt-1 text-sm text-red-700">{errors.country.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="nationality">Nationality</label>
            <input id="nationality" className="input" {...register("nationality")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="dateOfBirth">Date of birth (YYYY-MM-DD)</label>
            <input id="dateOfBirth" className="input" {...register("dateOfBirth")} />
          </div>
          <div>
            <label className="label" htmlFor="placeOfBirth">Place of birth</label>
            <input id="placeOfBirth" className="input" {...register("placeOfBirth")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="politicalParty">Political party</label>
            <input id="politicalParty" className="input" {...register("politicalParty")} />
          </div>
          <div>
            <label className="label" htmlFor="constituency">Constituency</label>
            <input id="constituency" className="input" {...register("constituency")} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="currentPosition">Current position</label>
          <input id="currentPosition" className="input" {...register("currentPosition")} />
        </div>

        <div>
          <label className="label" htmlFor="biography">Biography</label>
          <textarea id="biography" rows={5} className="input" {...register("biography")} />
        </div>

        <div>
          <label className="label" htmlFor="identityConfidence">Identity confidence</label>
          <select id="identityConfidence" className="input" {...register("identityConfidence")}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="unresolved">Unresolved — multiple candidates possible</option>
          </select>
        </div>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create draft profile"}
        </button>
      </form>
    </div>
  );
}
