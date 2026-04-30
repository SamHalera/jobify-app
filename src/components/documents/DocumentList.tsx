"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FileTextIcon, DownloadIcon, TrashIcon, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteDocument } from "@/actions/documents";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { DocumentWithCount } from "@/types";

export function DocumentList({ documents }: { documents: DocumentWithCount[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    startTransition(async () => {
      try {
        await deleteDocument(id);
        toast.success("Document supprimé");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    });
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg border-dashed">
        <FileTextIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Aucun document. Commencez par uploader votre CV.</p>
        <Link href="/documents/upload" className="mt-3 inline-block">
          <Button size="sm">Uploader un document</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
        >
          <FileTextIcon className="h-8 w-8 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium truncate">{doc.name}</p>
              <Badge variant="secondary">{DOCUMENT_TYPE_LABELS[doc.type]}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {doc.fileName} · {formatFileSize(doc.sizeBytes)} · Ajouté le {formatDate(doc.createdAt)}
            </p>
            <p className="text-xs text-muted-foreground">
              Utilisé dans{" "}
              <span className="font-medium">{doc._count.applications}</span>{" "}
              candidature{doc._count.applications !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a href={`/api/files/${encodeURIComponent(doc.storagePath.split("/").pop() ?? "")}`} target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="ghost" title="Visualiser">
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </a>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(doc.id, doc.name)}
              disabled={isPending}
              title="Supprimer"
            >
              <TrashIcon className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
