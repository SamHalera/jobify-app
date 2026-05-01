import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon, GlobeIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { CompanyEditDialog } from "@/components/companies/CompanyEditDialog";
import { getCompanyById } from "@/actions/companies";
import type { ApplicationWithCount } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params;
  const company = await getCompanyById(id);
  if (!company) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link
          href="/companies"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Retour aux entreprises
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
              >
                <GlobeIcon className="h-3.5 w-3.5" />
                {company.website}
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <CompanyEditDialog company={company} />
            <Link href={`/applications/new`}>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-1" />
                Nouvelle candidature
              </Button>
            </Link>
          </div>
        </div>
        {company.notes && (
          <p className="text-sm text-muted-foreground mt-2">{company.notes}</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          {company._count.applications} candidature{company._count.applications !== 1 ? "s" : ""}
        </h2>
        {company.applications.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucune candidature pour cette entreprise.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {company.applications.map((app: ApplicationWithCount) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
