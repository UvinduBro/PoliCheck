import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeletePolitician, usePublishPolitician } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/lib/permissions/roles";
import type { Politician } from "@/types";

export function PoliticianStatusActions({ politician }: { politician: Politician }) {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const publishMutation = usePublishPolitician(user?.uid ?? "");
  const deleteMutation = useDeletePolitician(user?.uid ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const role = userProfile?.role;

  if (!user || !can.createRecords(role)) return null;

  async function handleDelete() {
    await deleteMutation.mutateAsync(politician.id);
    navigate("/politicians");
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-line bg-surface-2/60 p-3">
      <Link to={`/politicians/${politician.id}/edit`} className="btn-secondary">
        Edit profile
      </Link>
      {politician.publicationStatus === "draft" && (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => publishMutation.mutate({ id: politician.id, status: "review" })}
        >
          Submit for review
        </button>
      )}
      {can.publishRecords(role) && politician.publicationStatus === "review" && (
        <>
          <button
            type="button"
            className="btn-primary"
            onClick={() => publishMutation.mutate({ id: politician.id, status: "published" })}
          >
            Approve &amp; publish
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => publishMutation.mutate({ id: politician.id, status: "draft" })}
          >
            Send back to draft
          </button>
        </>
      )}
      {can.publishRecords(role) && politician.publicationStatus === "published" && (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => publishMutation.mutate({ id: politician.id, status: "archived" })}
        >
          Archive
        </button>
      )}

      {can.deleteRecords(role) && (
        <div className="ml-auto flex items-center gap-2">
          {confirmingDelete ? (
            <>
              <span className="text-sm text-status-critical">Delete this profile permanently?</span>
              <button
                type="button"
                className="btn-secondary border-status-critical/40 text-status-critical hover:bg-status-critical-bg"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Confirm delete"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-secondary border-status-critical/40 text-status-critical hover:bg-status-critical-bg"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete profile
            </button>
          )}
        </div>
      )}
    </div>
  );
}
