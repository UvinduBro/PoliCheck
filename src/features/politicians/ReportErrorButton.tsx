import { useState } from "react";
import { COLLECTIONS, createDoc } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

export function ReportErrorButton({ politicianId }: { politicianId: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (description.trim().length === 0) {
      setError("Please describe the issue.");
      return;
    }
    try {
      await createDoc(COLLECTIONS.correctionRequests, {
        politicianId,
        description: description.trim(),
        submittedByUid: user?.uid,
        submittedByEmail: user?.email ?? undefined,
        status: "open",
      });
      setSubmitted(true);
    } catch {
      setError("Could not submit your report. Please try again.");
    }
  }

  if (!open) {
    return (
      <button type="button" className="text-sm text-accent hover:underline" onClick={() => setOpen(true)}>
        Report an error on this profile
      </button>
    );
  }

  if (submitted) {
    return <p className="text-sm text-status-verified">Thank you — this has been sent to our review team.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-md space-y-2 p-4">
      <label className="label" htmlFor="error-description">What's inaccurate or out of date?</label>
      <textarea
        id="error-description"
        className="input"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {error && <p role="alert" className="text-sm text-status-critical">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Submit report</button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
