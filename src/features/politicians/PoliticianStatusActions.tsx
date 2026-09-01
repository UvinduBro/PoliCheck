import { Link } from "react-router-dom";
import { usePublishPolitician } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/lib/permissions/roles";
import type { Politician } from "@/types";

export function PoliticianStatusActions({ politician }: { politician: Politician }) {
  const { user, userProfile } = useAuth();
  const publishMutation = usePublishPolitician(user?.uid ?? "");
  const role = userProfile?.role;

  if (!user || !can.createRecords(role)) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
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
    </div>
  );
}
