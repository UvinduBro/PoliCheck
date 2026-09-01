import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateSource } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { COLLECTIONS, updateDocById } from "@/lib/firebase/firestore";
import { sourceSchema, type SourceFormValues } from "@/lib/validation/schemas";
import { suggestedTierForSourceType } from "@/lib/legal-status/sourceTier";
import { SOURCE_TYPE_LABELS } from "@/constants/sourceTiers";
import { uploadResearchFile, validateUpload } from "@/lib/firebase/storage";

const SOURCE_TYPES = Object.keys(SOURCE_TYPE_LABELS) as (keyof typeof SOURCE_TYPE_LABELS)[];

export function SourceFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createMutation = useCreateSource(user?.uid ?? "");
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SourceFormValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues: { tier: 3, verificationStatus: "unverified", sourceType: "news_article" },
  });

  const sourceType = watch("sourceType");
  const suggestedTier = suggestedTierForSourceType(sourceType);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFileError(null);
    if (selected) {
      const validationError = validateUpload(selected);
      if (validationError) {
        setFileError(validationError);
        setFile(null);
        return;
      }
    }
    setFile(selected);
  }

  async function onSubmit(values: SourceFormValues) {
    setError(null);
    try {
      const id = await createMutation.mutateAsync({
        ...values,
        accessedAt: Timestamp.now(),
      });
      if (file && user) {
        const uploaded = await uploadResearchFile({ kind: "sources", entityId: id }, file, user.uid);
        await updateDocById(COLLECTIONS.sources, id, { filePath: uploaded.filePath });
      }
      navigate(`/sources/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save this source.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900">Add a Source</h1>
      <p className="mt-1 text-sm text-gray-600">
        Court judgments, government records, and official statements should be tagged Tier 1. Tier 4 sources
        (blogs, anonymous sites, social media) can never be used alone as evidence of guilt.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input id="title" className="input" {...register("title")} />
          {errors.title && <p className="mt-1 text-sm text-red-700">{errors.title.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="publisher">Publisher</label>
            <input id="publisher" className="input" {...register("publisher")} />
            {errors.publisher && <p className="mt-1 text-sm text-red-700">{errors.publisher.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="sourceType">Source type</label>
            <select id="sourceType" className="input" {...register("sourceType")}>
              {SOURCE_TYPES.map((type) => (
                <option key={type} value={type}>{SOURCE_TYPE_LABELS[type]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="tier">
            Source tier {suggestedTier && <span className="text-gray-500">(suggested: Tier {suggestedTier})</span>}
          </label>
          <select
            id="tier"
            className="input"
            {...register("tier", { setValueAs: (v) => Number(v) })}
            onBlur={() => suggestedTier && setValue("tier", suggestedTier)}
          >
            <option value={1}>Tier 1 — Primary &amp; Authoritative</option>
            <option value={2}>Tier 2 — Highly Reliable Journalism</option>
            <option value={3}>Tier 3 — Secondary Source</option>
            <option value={4}>Tier 4 — Low Confidence</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="url">URL</label>
          <input id="url" className="input" {...register("url")} />
          {errors.url && <p className="mt-1 text-sm text-red-700">{errors.url.message}</p>}
        </div>

        <div>
          <label className="label" htmlFor="archiveUrl">Archive URL (recommended)</label>
          <input id="archiveUrl" className="input" {...register("archiveUrl")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="publicationDate">Publication date</label>
            <input id="publicationDate" className="input" placeholder="YYYY-MM-DD" {...register("publicationDate")} />
          </div>
          <div>
            <label className="label" htmlFor="documentDate">Document date (for court records)</label>
            <input id="documentDate" className="input" placeholder="YYYY-MM-DD" {...register("documentDate")} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="verificationStatus">Verification status</label>
          <select id="verificationStatus" className="input" {...register("verificationStatus")}>
            <option value="unverified">Unverified</option>
            <option value="partially_verified">Partially Verified</option>
            <option value="verified">Verified</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="summary">Summary</label>
          <textarea id="summary" rows={3} className="input" {...register("summary")} />
        </div>

        <div>
          <label className="label" htmlFor="notes">Notes</label>
          <textarea id="notes" rows={2} className="input" {...register("notes")} />
        </div>

        <div>
          <label className="label" htmlFor="document">Attach a document (PDF, PNG, JPEG — max 25MB)</label>
          <input id="document" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={onFileChange} />
          {fileError && <p className="mt-1 text-sm text-red-700">{fileError}</p>}
        </div>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save source"}
        </button>
      </form>
    </div>
  );
}
