import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { UploadForm } from "@/components/documents/UploadForm";

export default function UploadDocumentPage() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link
          href="/documents"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Retour aux documents
        </Link>
        <h1 className="text-2xl font-bold">Uploader un document</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ajoutez un CV ou une lettre de motivation à votre bibliothèque.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
