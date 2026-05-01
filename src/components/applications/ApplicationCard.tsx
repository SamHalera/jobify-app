"use client"
import Link from "next/link";
import { MapPinIcon, ExternalLinkIcon, LayersIcon, FileTextIcon, BanknoteIcon } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/lib/utils";
import type { ApplicationWithCount } from "@/types";

export function ApplicationCard({ application }: { application: ApplicationWithCount }) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 card-shadow transition-all duration-200 hover:card-shadow-md hover:-translate-y-1 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-[#F72585] via-[#7209B7] to-[#3A0CA3] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <Link
            href={`/applications/${application.id}`}
            className="block font-semibold text-foreground hover:text-primary transition-colors truncate leading-snug"
          >
            {application.jobTitle}
          </Link>
          <Link
            href={`/companies/${application.company.id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-0.5 block"
          >
            {application.company.name}
          </Link>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-4">
        {application.location && (
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-3 w-3 shrink-0" />
            {application.location}
            {application.isRemote && <span className="ml-1 rounded bg-muted px-1 py-0.5 text-[10px] font-medium">Remote</span>}
          </span>
        )}
        {application.salary && (
          <span className="flex items-center gap-1 font-medium text-foreground/70">
            <BanknoteIcon className="h-3 w-3 shrink-0" />
            {application.salary}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60">
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <LayersIcon className="h-3 w-3" />
            {application._count.stages} étape{application._count.stages !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <FileTextIcon className="h-3 w-3" />
            {application._count.documents} doc{application._count.documents !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {application.appliedAt && (
            <span className="text-xs text-muted-foreground">
              {formatDate(application.appliedAt)}
            </span>
          )}
          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
