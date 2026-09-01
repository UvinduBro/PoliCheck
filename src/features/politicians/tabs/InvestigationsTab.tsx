import { useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianInvestigations } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { DataTable, type Column } from "@/components/tables/DataTable";
import type { Investigation } from "@/types";
import { formatDate } from "@/lib/formatting/date";

const STATUS_LABELS: Record<Investigation["currentStatus"], string> = {
  open: "Open",
  closed: "Closed",
  referred: "Referred",
  unknown: "Unknown",
};

const TYPE_LABELS: Record<Investigation["investigationType"], string> = {
  corruption: "Corruption",
  financial: "Financial",
  police: "Police",
  tax: "Tax",
  election: "Election",
  other: "Other",
};

export function InvestigationsTab() {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { data: investigations = [], isLoading } = usePoliticianInvestigations(politician.id, userProfile?.role);

  const columns: Column<Investigation>[] = [
    { header: "Agency", render: (i) => i.agency },
    { header: "Type", render: (i) => TYPE_LABELS[i.investigationType] },
    { header: "Started", render: (i) => (i.startDate ? formatDate(i.startDate) : "Unknown") },
    { header: "Status", render: (i) => STATUS_LABELS[i.currentStatus] },
    { header: "Latest Development", render: (i) => i.latestDevelopment || i.description || "—" },
  ];

  if (isLoading) return <p className="text-sm text-gray-500">Loading investigations...</p>;

  return (
    <DataTable columns={columns} rows={investigations} emptyMessage="No investigations have been recorded." />
  );
}
