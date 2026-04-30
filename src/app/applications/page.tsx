import Link from "next/link";
import { PlusIcon, BriefcaseIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { getApplications } from "@/actions/applications";
import { STATUS_LABELS, STATUS_DOT } from "@/types";
import type { ApplicationStatus } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

const ALL_STATUSES = Object.keys(STATUS_LABELS) as ApplicationStatus[];

export default async function ApplicationsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const filterStatus = ALL_STATUSES.includes(status as ApplicationStatus)
    ? (status as ApplicationStatus)
    : undefined;

  const applications = await getApplications(filterStatus ? { status: filterStatus } : undefined);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Candidatures</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-foreground">{applications.length}</span>{" "}
            candidature{applications.length !== 1 ? "s" : ""}
            {filterStatus ? ` · ${STATUS_LABELS[filterStatus]}` : " au total"}
          </p>
        </div>
        <Link href="/applications/new">
          <Button className="gap-2 shadow-sm shadow-[#2E9CCA]/30 bg-linear-to-r from-[#2E9CCA] to-[#464866] hover:from-[#25274D] hover:to-[#2E9CCA] border-0 text-white transition-all duration-300">
            <PlusIcon className="h-4 w-4" />
            Nouvelle candidature
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Link href="/applications">
          <button className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
            !filterStatus
              ? "bg-linear-to-r from-[#2E9CCA] to-[#464866] text-white shadow-sm shadow-[#2E9CCA]/30"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}>
            Toutes
          </button>
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link key={s} href={`/applications?status=${s}`}>
            <button className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
              filterStatus === s
                ? "bg-linear-to-r from-[#2E9CCA] to-[#464866] text-white shadow-sm shadow-[#2E9CCA]/30"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[s])} />
              {STATUS_LABELS[s]}
            </button>
          </Link>
        ))}
      </div>

      {/* Grid */}
      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border bg-muted/30">
          {filterStatus ? (
            <SearchIcon className="h-10 w-10 text-muted-foreground/50 mb-4" />
          ) : (
            <BriefcaseIcon className="h-10 w-10 text-muted-foreground/50 mb-4" />
          )}
          <p className="font-medium text-muted-foreground">
            {filterStatus ? `Aucune candidature avec ce statut` : "Aucune candidature"}
          </p>
          {!filterStatus && (
            <Link href="/applications/new" className="mt-4">
              <Button size="sm" className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Créer la première
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
