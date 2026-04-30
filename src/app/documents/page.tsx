import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentList } from "@/components/documents/DocumentList";
import { getDocuments } from "@/actions/documents";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {documents.length} document{documents.length !== 1 ? "s" : ""} · CV et lettres de motivation
          </p>
        </div>
        <Link href="/documents/upload">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Uploader un document
          </Button>
        </Link>
      </div>
      <DocumentList documents={documents} />
    </div>
  );
}
