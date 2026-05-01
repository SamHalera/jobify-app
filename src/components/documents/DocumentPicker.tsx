"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { PaperclipIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { attachDocumentToApplication, detachDocumentFromApplication } from "@/actions/documents";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import type { Document, ApplicationDocument } from "@/types";

interface Props {
  applicationId: string;
  attachedDocs: (ApplicationDocument & { document: Document })[];
  allDocs: Document[];
}

export function DocumentPicker({ applicationId, attachedDocs, allDocs }: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const attachedIds = new Set(attachedDocs.map((ad) => ad.documentId));

  function attach(documentId: string) {
    startTransition(async () => {
      try {
        await attachDocumentToApplication(applicationId, documentId);
        toast.success("Document attaché");
      } catch {
        toast.error("Erreur lors de l'attachement");
      }
    });
  }

  function detach(documentId: string) {
    startTransition(async () => {
      try {
        await detachDocumentFromApplication(applicationId, documentId);
        toast.success("Document retiré");
      } catch {
        toast.error("Erreur lors du retrait");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Documents joints</h2>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
            <PaperclipIcon className="h-4 w-4" />
            Joindre un document
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Choisir des documents</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-2">
              {allDocs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun document disponible. Uploadez-en depuis la bibliothèque.</p>
              ) : (
                allDocs.map((doc) => {
                  const attached = attachedIds.has(doc.id);
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{DOCUMENT_TYPE_LABELS[doc.type]}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={attached ? "destructive" : "default"}
                        disabled={isPending}
                        onClick={() => (attached ? detach(doc.id) : attach(doc.id))}
                      >
                        {attached ? "Retirer" : "Attacher"}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {attachedDocs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
          Aucun document joint à cette candidature.
        </p>
      ) : (
        <div className="space-y-2">
          {attachedDocs.map(({ document }) => (
            <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <a
                  href={document.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline"
                >
                  {document.name}
                </a>
                <Badge variant="secondary" className="text-xs">
                  {DOCUMENT_TYPE_LABELS[document.type]}
                </Badge>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => detach(document.id)}
                disabled={isPending}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
