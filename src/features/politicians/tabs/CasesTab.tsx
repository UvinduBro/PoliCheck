import { Link, useOutletContext } from "react-router-dom";
import type { PoliticianOutletContext } from "../PoliticianProfileLayout";
import { usePoliticianCases } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { CASE_STAGE_LABELS } from "@/constants/legalStatus";
import { DataTable, type Column } from "@/components/tables/DataTable";
import type { LegalCase } from "@/types";
import { formatDate } from "@/lib/formatting/date";

export function CasesTab({ caseType }: { caseType: "criminal" | "civil" }) {
  const { politician } = useOutletContext<PoliticianOutletContext>();
  const { userProfile } = useAuth();
  const { data: cases = [], isLoading } = usePoliticianCases(politician.id, userProfile?.role);
  const filtered = cases.filter((c) => c.caseType === caseType);

  const columns: Column<LegalCase>[] = [
    {
      header: "Case",
      render: (c) => (
        <Link to={`/cases/${c.id}`} className="font-medium text-blue-800 hover:underline">
          {c.caseName}
        </Link>
      ),
    },
    { header: "Court", render: (c) => c.court || "—" },
    { header: "Stage", render: (c) => CASE_STAGE_LABELS[c.legalStage] },
    { header: "Filed", render: (c) => (c.dateFiled ? formatDate(c.dateFiled) : "Unknown") },
    { header: "Current Status", render: (c) => c.currentStatus },
  ];

  if (isLoading) return <p className="text-sm text-gray-500">Loading cases...</p>;

  return (
    <DataTable
      columns={columns}
      rows={filtered}
      emptyMessage={`No ${caseType} cases have been recorded.`}
    />
  );
}
