import { Link } from "react-router-dom";
import { usePoliticians } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";

export function ResearchHomePage() {
  const { userProfile } = useAuth();
  const { data: politicians = [] } = usePoliticians(userProfile?.role);
  const myDrafts = politicians.filter((p) => p.createdBy === userProfile?.uid);

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900">Research Workspace</h1>
      <p className="mt-1 text-sm text-gray-600">
        Add new records here. Always verify identity and collect sources before adding legal records — see
        the research workflow in the project documentation.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/politicians/new" className="card block p-4 hover:border-blue-300">
          <h2 className="font-medium text-gray-900">Add a Politician</h2>
          <p className="mt-1 text-sm text-gray-600">Start with identity verification.</p>
        </Link>
        <Link to="/sources/new" className="card block p-4 hover:border-blue-300">
          <h2 className="font-medium text-gray-900">Add a Source</h2>
          <p className="mt-1 text-sm text-gray-600">Cite a court judgment, article, or record.</p>
        </Link>
        <Link to="/cases/new" className="card block p-4 hover:border-blue-300">
          <h2 className="font-medium text-gray-900">Add a Legal Case</h2>
          <p className="mt-1 text-sm text-gray-600">Criminal, civil, or corruption case.</p>
        </Link>
        <Link to="/investigations/new" className="card block p-4 hover:border-blue-300">
          <h2 className="font-medium text-gray-900">Add an Investigation</h2>
          <p className="mt-1 text-sm text-gray-600">Corruption, financial, or police investigation.</p>
        </Link>
        <Link to="/legal-events/new" className="card block p-4 hover:border-blue-300">
          <h2 className="font-medium text-gray-900">Add a Timeline Event</h2>
          <p className="mt-1 text-sm text-gray-600">Arrest, bail, judgment, and more.</p>
        </Link>
        <Link to="/claims/new" className="card block p-4 hover:border-blue-300">
          <h2 className="font-medium text-gray-900">Add a Claim</h2>
          <p className="mt-1 text-sm text-gray-600">Classify a specific claim for the fact-vs-allegation table.</p>
        </Link>
      </div>

      <h2 className="mt-8 font-semibold text-gray-900">Your Draft Profiles</h2>
      {myDrafts.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">You haven't created any profiles yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
          {myDrafts.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <Link to={`/politicians/${p.id}/overview`} className="text-blue-800 hover:underline">{p.fullName}</Link>
              <PublicationStatusBadge status={p.publicationStatus} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
