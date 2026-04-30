import { getApplicationStats } from "@/actions/applications";
import { getCompanies } from "@/actions/companies";
import { getDocuments } from "@/actions/documents";
import { StatsCharts } from "@/components/stats/StatsCharts";
import { STATUS_LABELS } from "@/types";
import type { ApplicationStatus } from "@/types";
import { BriefcaseIcon, BuildingIcon, FileTextIcon, TrendingUpIcon } from "lucide-react";

type StatusCount = { status: ApplicationStatus; count: number };
type MonthlyCount = { month: string; count: number };

export default async function StatsPage() {
  const [stats, companies, documents] = await Promise.all([
    getApplicationStats(),
    getCompanies(),
    getDocuments(),
  ]);

  const totalApplications = stats.statusCounts.reduce((sum: number, s: StatusCount) => sum + s.count, 0);
  const activeCount = stats.statusCounts
    .filter((s: StatusCount) => ["APPLIED", "IN_PROGRESS", "OFFER"].includes(s.status))
    .reduce((sum: number, s: StatusCount) => sum + s.count, 0);
  const acceptedCount = stats.statusCounts.find((s: StatusCount) => s.status === "ACCEPTED")?.count ?? 0;
  const rejectedCount = stats.statusCounts.find((s: StatusCount) => s.status === "REJECTED")?.count ?? 0;

  const pieData = stats.statusCounts.map((s: StatusCount) => ({
    name: STATUS_LABELS[s.status],
    value: s.count,
    status: s.status,
  }));

  const barData = stats.monthly.map((m: MonthlyCount) => ({
    month: m.month,
    candidatures: m.count,
  }));

  const kpis = [
    { label: "Total", value: totalApplications, icon: BriefcaseIcon, color: "text-violet-600", bg: "bg-violet-50 ring-1 ring-violet-100" },
    { label: "En cours", value: activeCount, icon: TrendingUpIcon, color: "text-amber-600", bg: "bg-amber-50 ring-1 ring-amber-100" },
    { label: "Entreprises", value: companies.length, icon: BuildingIcon, color: "text-blue-600", bg: "bg-blue-50 ring-1 ring-blue-100" },
    { label: "Documents", value: documents.length, icon: FileTextIcon, color: "text-emerald-600", bg: "bg-emerald-50 ring-1 ring-emerald-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d&apos;ensemble de ta recherche d&apos;emploi</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 card-shadow">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg} mb-3`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Résumé succès */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-3xl font-bold text-emerald-700">{acceptedCount}</p>
          <p className="text-sm text-emerald-600 mt-0.5">Offres acceptées</p>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
          <p className="text-sm text-red-500 mt-0.5">Refus reçus</p>
        </div>
      </div>

      <StatsCharts pieData={pieData} barData={barData} />
    </div>
  );
}
