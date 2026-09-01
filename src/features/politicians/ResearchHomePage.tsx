import { Link } from "react-router-dom";
import { FileText, Gavel, Landmark, ListChecks, ScrollText, UserPlus } from "lucide-react";
import { usePoliticians } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";

const ACTIONS = [
  { to: "/politicians/new", icon: UserPlus, title: "Add a Politician", desc: "Start with identity verification." },
  { to: "/sources/new", icon: FileText, title: "Add a Source", desc: "Cite a court judgment, article, or record." },
  { to: "/cases/new", icon: Gavel, title: "Add a Legal Case", desc: "Criminal, civil, or corruption case." },
  { to: "/investigations/new", icon: Landmark, title: "Add an Investigation", desc: "Corruption, financial, or police investigation." },
  { to: "/legal-events/new", icon: ScrollText, title: "Add a Timeline Event", desc: "Arrest, bail, judgment, and more." },
  { to: "/claims/new", icon: ListChecks, title: "Add a Claim", desc: "Classify a claim for the fact-vs-allegation table." },
];

export function ResearchHomePage() {
  const { userProfile } = useAuth();
  const { data: politicians = [] } = usePoliticians(userProfile?.role);
  const myDrafts = politicians.filter((p) => p.createdBy === userProfile?.uid);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Research Workspace</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Add new records here. Always verify identity and collect sources before adding legal records — see
        the research workflow in the project documentation.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="card-hover group block p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400 dark:group-hover:bg-brand-500/25">
              <Icon size={20} aria-hidden="true" />
            </span>
            <h2 className="mt-3 font-medium text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-semibold text-slate-900 dark:text-white">Your Draft Profiles</h2>
      {myDrafts.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">You haven't created any profiles yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {myDrafts.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <Link to={`/politicians/${p.id}/overview`} className="text-brand-700 hover:underline dark:text-brand-400">
                {p.fullName}
              </Link>
              <PublicationStatusBadge status={p.publicationStatus} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
