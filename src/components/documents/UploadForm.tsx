"use client";

import { useRouter } from "next/navigation";
import { useTransition, useRef } from "react";
import { toast } from "sonner";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadDocument } from "@/actions/documents";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import type { DocumentType } from "@/types";

const TYPES = Object.entries(DOCUMENT_TYPE_LABELS) as [DocumentType, string][];

export function UploadForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await uploadDocument(formData);
        toast.success("Document uploadé avec succès");
        router.push("/documents");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du document *</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="ex. CV Développeur Frontend – Avril 2026"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select name="type" defaultValue="CV" required>
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Fichier PDF *</Label>
        <div className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
          <UploadIcon className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <Input
              ref={fileRef}
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              required
              className="border-0 p-0 h-auto file:mr-4 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">PDF uniquement · Maximum 10 Mo</p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Upload en cours..." : "Uploader le document"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
