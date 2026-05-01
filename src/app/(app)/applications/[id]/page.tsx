import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon, PencilIcon, MapPinIcon, BanknoteIcon,
  ExternalLinkIcon, CalendarIcon, ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { StageList } from "@/components/stages/StageList";
import { DocumentPicker } from "@/components/documents/DocumentPicker";
import { getApplicationById } from "@/actions/applications";
import { getDocuments } from "@/actions/documents";
import { formatDate, formatRelative } from "@/lib/utils";
import { DeleteApplicationButton } from "@/components/applications/DeleteApplicationButton";

interface Props {
  params: Promise<{ id: string }>;
}

function MetaItem({ icon: Icon, label, children }: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">{label}</p>
      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        {children}
      </div>
    </div>
  );
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  const [application, allDocs] = await Promise.all([
    getApplicationById(id),
    getDocuments(),
  ]);

  if (!application) notFound();

  return (
    <div className="max-w-3xl space-y-8">
      {/* Breadcrumb + actions */}
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Candidatures
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold leading-tight">{application.jobTitle}</h1>
            <Link
              href={`/companies/${application.company.id}`}
              className="text-muted-foreground hover:text-primary font-medium transition-colors mt-1 block"
            >
              {application.company.name}
            </Link>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/applications/${id}/edit`}>
              <Button size="sm" variant="outline" className="gap-1.5">
                <PencilIcon className="h-3.5 w-3.5" />
                Modifier
              </Button>
            </Link>
            <DeleteApplicationButton id={id} />
          </div>
        </div>
      </div>

      {/* Metadata card */}
      <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">Statut</p>
            <StatusBadge status={application.status} />
          </div>

          {application.location && (
            <MetaItem icon={MapPinIcon} label="Localisation">
              {application.location}
              {application.isRemote && (
                <span className="ml-1.5 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">Remote</span>
              )}
            </MetaItem>
          )}

          {application.salary && (
            <MetaItem icon={BanknoteIcon} label="Salaire">
              {application.salary}
            </MetaItem>
          )}

          {application.appliedAt && (
            <MetaItem icon={CalendarIcon} label="Date candidature">
              {formatDate(application.appliedAt)}
            </MetaItem>
          )}

          <MetaItem icon={ClockIcon} label="Créé">
            {formatRelative(application.createdAt)}
          </MetaItem>

          {application.jobUrl && (
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">Offre</p>
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Voir l&apos;offre <ExternalLinkIcon className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {application.notes && (
        <div className="space-y-2">
          <h2 className="text-base font-semibold">Notes</h2>
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed card-shadow">
            {application.notes}
          </div>
        </div>
      )}

      {/* Stages */}
      <StageList stages={application.stages} applicationId={id} />

      {/* Documents */}
      <DocumentPicker
        applicationId={id}
        attachedDocs={application.documents}
        allDocs={allDocs}
      />
    </div>
  );
}
