"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const STATUS_CHART_COLORS: Record<string, string> = {
  WISHLIST: "#94a3b8",
  APPLIED: "#3b82f6",
  IN_PROGRESS: "#f59e0b",
  OFFER: "#a855f7",
  ACCEPTED: "#22c55e",
  REJECTED: "#ef4444",
  WITHDRAWN: "#f97316",
  GHOSTED: "#6b7280",
};

interface PieEntry { name: string; value: number; status: string }
interface BarEntry { month: string; candidatures: number }

export function StatsCharts({
  pieData,
  barData,
}: {
  pieData: PieEntry[];
  barData: BarEntry[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">Répartition par statut</h2>
        {pieData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Aucune donnée</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_CHART_COLORS[entry.status] ?? "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} candidature(s)`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">Candidatures par mois</h2>
        {barData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Aucune donnée</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="candidatures" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
