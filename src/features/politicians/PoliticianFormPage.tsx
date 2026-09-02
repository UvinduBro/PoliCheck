import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCreatePolitician, usePolitician, useUpdatePolitician } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { politicianSchema, type PoliticianFormValues } from "@/lib/validation/schemas";
import { useFeatureFlags } from "@/features/settings/api";
import { uploadResearchFile, validateUpload } from "@/lib/firebase/storage";

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { flags } = useFeatureFlags();

  useEffect(() => {
    if (!photoFile) return;
    const objectUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photoFile]);

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setPhotoError(null);
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setPhotoError("Choose an image file (PNG, JPEG, or WebP).");
        setPhotoFile(null);
        return;
      }
      const validationError = validateUpload(selected);
      if (validationError) {
        setPhotoError(validationError);
        setPhotoFile(null);
        return;
      }
    }
    setPhotoFile(selected);
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PoliticianFormValues>({
    resolver: zodResolver(politicianSchema),
    defaultValues: { custodyStatus: "not_in_custody", country: "Sri Lanka" },
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
          custodyStatus: existing.custodyStatus ?? "not_in_custody",
          custodySince: existing.custodySince,
          bailedSince: existing.bailedSince,
          sentenceYears: existing.sentenceYears,
          custodySourceLink: existing.custodySourceLink,
        }
      : undefined,
  });

  const custodyStatus = watch("custodyStatus");
  const inCustody = custodyStatus === "jailed" || custodyStatus === "bailed";

  async function onSubmit(values: PoliticianFormValues) {
    setError(null);
    try {
      const id = isEditing && politicianId ? politicianId : undefined;
      if (id) {
        await updateMutation.mutateAsync({ id, data: values });
      }

      const newId = id ?? (await createMutation.mutateAsync({ ...values, publicationStatus: "draft" }));

      if (photoFile && user) {
        setUploadingPhoto(true);
        const uploaded = await uploadResearchFile({ kind: "politicians", entityId: newId }, photoFile, user.uid);
        await updateMutation.mutateAsync({ id: newId, data: { photoUrl: uploaded.downloadUrl } });
        setUploadingPhoto(false);
      }

      navigate(`/politicians/${newId}/overview`);
    } catch (e) {
      setUploadingPhoto(false);
      setError(e instanceof Error ? e.message : "Could not save this profile.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-page-heading font-semibold text-ink">
        {isEditing ? "Edit Politician Profile" : "Add a New Politician"}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Verify identity carefully before adding legal records. If multiple people share this name, create
        separate profiles rather than merging them.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="fullName">Full legal name</label>
          <input id="fullName" className="input" {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-sm text-status-critical">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="photo">Profile photo (optional)</label>
          <div className="flex items-center gap-4">
            {(photoPreview || existing?.photoUrl) && (
              <img
                src={photoPreview ?? existing?.photoUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            )}
            <input
              id="photo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onPhotoChange}
              className="text-sm text-ink-muted file:mr-3 file:rounded-md file:border file:border-line file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-surface-2"
            />
          </div>
          {photoError && <p className="mt-1 text-sm text-status-critical">{photoError}</p>}
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
            {errors.country && <p className="mt-1 text-sm text-status-critical">{errors.country.message}</p>}
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

        {flags.biography && (
          <div>
            <label className="label" htmlFor="biography">Biography</label>
            <textarea id="biography" rows={5} className="input" {...register("biography")} />
          </div>
        )}

        <fieldset className="rounded-md border border-line p-4">
          <legend className="label px-1">Current custody status</legend>
          <select id="custodyStatus" className="input" {...register("custodyStatus")}>
            <option value="not_in_custody">Not in custody</option>
            <option value="bailed">On bail</option>
            <option value="jailed">Jailed</option>
          </select>

          {inCustody && (
            <div className="mt-3 space-y-3">
              {custodyStatus === "bailed" && (
                <p className="text-xs text-ink-faint">
                  Record when this person was originally jailed and, if sentenced, for how long. Bail
                  typically follows an initial jailing or conviction.
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="custodySince">Jailed since</label>
                  <input id="custodySince" className="input" placeholder="YYYY-MM-DD" {...register("custodySince")} />
                  {errors.custodySince && <p className="mt-1 text-sm text-status-critical">{errors.custodySince.message}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="sentenceYears">Sentence (years)</label>
                  <input
                    id="sentenceYears"
                    type="number"
                    min={0}
                    max={100}
                    className="input"
                    {...register("sentenceYears")}
                  />
                  {errors.sentenceYears && <p className="mt-1 text-sm text-status-critical">{errors.sentenceYears.message}</p>}
                </div>
              </div>
              {custodyStatus === "bailed" && (
                <div>
                  <label className="label" htmlFor="bailedSince">Bailed since</label>
                  <input id="bailedSince" className="input" placeholder="YYYY-MM-DD" {...register("bailedSince")} />
                  {errors.bailedSince && <p className="mt-1 text-sm text-status-critical">{errors.bailedSince.message}</p>}
                </div>
              )}
              <div>
                <label className="label" htmlFor="custodySourceLink">Source link</label>
                <input id="custodySourceLink" className="input" placeholder="https://…" {...register("custodySourceLink")} />
                {errors.custodySourceLink && <p className="mt-1 text-sm text-status-critical">{errors.custodySourceLink.message}</p>}
              </div>
            </div>
          )}
        </fieldset>

        <div>
          <label className="label" htmlFor="identityConfidence">Identity confidence</label>
          <select id="identityConfidence" className="input" {...register("identityConfidence")}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="unresolved">Unresolved (multiple candidates possible)</option>
          </select>
        </div>

        {error && <p role="alert" className="text-sm text-status-critical">{error}</p>}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {uploadingPhoto
            ? "Uploading photo..."
            : isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create draft profile"}
        </button>
      </form>
    </div>
  );
}
