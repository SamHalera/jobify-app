import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { getApplicationById } from "@/actions/applications";
import { getCompanies } from "@/actions/companies";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditApplicationPage({ params }: Props) {
  const { id } = await params;
  const [application, companies] = await Promise.all([
    getApplicationById(id),
    getCompanies(),
  ]);

  if (!application) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/applications/${id}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Retour à la candidature
        </Link>
        <h1 className="text-2xl font-bold">Modifier la candidature</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {application.jobTitle} · {application.company.name}
        </p>
      </div>
      <ApplicationForm companies={companies} application={application} />
    </div>
  );
}
