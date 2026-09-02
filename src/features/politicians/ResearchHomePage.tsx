import { Link } from "react-router-dom";
import { FileText, Gavel, Landmark, ListChecks, ScrollText, UserPlus } from "lucide-react";
import { usePoliticians } from "./api";
import { useAuth } from "@/hooks/useAuth";
import { PublicationStatusBadge } from "@/components/status/PublicationStatusBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useFeatureFlags } from "@/features/settings/api";
import type { FeatureFlagKey } from "@/constants/featureFlags";

const ACTIONS: { to: string; icon: typeof UserPlus; title: string; desc: string; flag?: FeatureFlagKey }[] = [
  { to: "/politicians/new", icon: UserPlus, title: "Add a Politician", desc: "Start with identity verification." },
  { to: "/cases/new", icon: Gavel, title: "Add a Legal Case", desc: "Criminal, civil, or corruption case." },
  { to: "/claims/new", icon: ListChecks, title: "Add a Claim", desc: "Classify a claim for the fact-vs-allegation table." },
  { to: "/sources/new", icon: FileText, title: "Add a Source", desc: "Cite a court judgment, article, or record.", flag: "sources" },
  { to: "/investigations/new", icon: Landmark, title: "Add an Investigation", desc: "Corruption, financial, or police investigation.", flag: "investigations" },
  { to: "/legal-events/new", icon: ScrollText, title: "Add a Timeline Event", desc: "Arrest, bail, judgment, and more.", flag: "timeline" },
];

export function ResearchHomePage() {
  const { userProfile } = useAuth();
  const { data: politicians = [] } = usePoliticians(userProfile?.role);
  const myDrafts = politicians.filter((p) => p.createdBy === userProfile?.uid);
  const { flags } = useFeatureFlags();
  const actions = ACTIONS.filter((a) => !a.flag || flags[a.flag]);

  return (
    <div>
      <h1 className="text-page-heading font-semibold text-ink">Research Workspace</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Add new records here. Always verify identity and collect sources before adding legal records — see
        the research workflow in the project documentation.
      </p>

      <h2 className="mt-8 text-section-heading font-semibold text-ink">Quick actions</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="card-hover group block p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
              <Icon size={20} aria-hidden="true" />
            </span>
            <h3 className="mt-3 font-medium text-ink">{title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-section-heading font-semibold text-ink">Your draft profiles</h2>
      {myDrafts.length === 0 ? (
        <div className="mt-3">
          <EmptyState title="No draft profiles yet" description="Profiles you create will appear here until they're published." />
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-surface">
          {myDrafts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <Link to={`/politicians/${p.id}/overview`} className="font-medium text-ink hover:text-accent">
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
