import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/hooks/useTheme";
import type { LegalStatusDashboardData } from "@/types";

export function LegalStatusSummaryChart({ data }: { data: LegalStatusDashboardData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#1e293b" : "#e2e8f0";
  const tickColor = isDark ? "#94a3b8" : "#64748b";
  const barColor = isDark ? "#6c8dff" : "#3145d6";

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
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              borderColor: isDark ? "#1e293b" : "#e2e8f0",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
            itemStyle={{ color: tickColor }}
          />
          <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
