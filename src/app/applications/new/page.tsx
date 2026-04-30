import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { getCompanies } from "@/actions/companies";

export default async function NewApplicationPage() {
  const companies = await getCompanies();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/applications"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Retour aux candidatures
        </Link>
        <h1 className="text-2xl font-bold">Nouvelle candidature</h1>
      </div>

      <ApplicationForm companies={companies} />
    </div>
  );
}
