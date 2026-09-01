import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LegalStatusDashboardData } from "@/types";

export function LegalStatusSummaryChart({ data }: { data: LegalStatusDashboardData }) {
  const chartData = [
    { name: "Criminal", value: data.activeCriminalCases },
    { name: "Civil", value: data.activeCivilCases },
    { name: "Investigations", value: data.activeInvestigations },
    { name: "Convictions", value: data.convictions },
    { name: "Acquittals", value: data.acquittals },
    { name: "Appeals", value: data.pendingAppeals },
  ];

  return (
    <div className="h-64 w-full" role="img" aria-label="Bar chart of active cases, investigations, convictions, acquittals, and pending appeals">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
