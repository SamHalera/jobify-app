"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { UploadIcon, CheckCircleIcon } from "lucide-react";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDocumentRecord } from "@/actions/documents";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import type { DocumentType } from "@/types";

const TYPES = Object.entries(DOCUMENT_TYPE_LABELS) as [DocumentType, string][];

export function UploadForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [type, setType] = useState<DocumentType>("CV");
  const [uploadedFile, setUploadedFile] = useState<CloudinaryUploadWidgetInfo | null>(null);

  function handleUploadSuccess(result: { info?: string | CloudinaryUploadWidgetInfo }) {
    const info = result.info as CloudinaryUploadWidgetInfo;
    if (info?.public_id) setUploadedFile(info);
  }

  function handleSave() {
    if (!uploadedFile) return;
    if (!name.trim()) {
      toast.error("Renseignez le nom du document");
      return;
    }

    startTransition(async () => {
      try {
        await createDocumentRecord({
          name: name.trim(),
          type,
          publicId: uploadedFile.public_id,
          source: uploadedFile.secure_url,
          fileName: uploadedFile.original_filename
            ? `${uploadedFile.original_filename}.${uploadedFile.format}`
            : uploadedFile.public_id,
          sizeBytes: uploadedFile.bytes,
          mimeType: "application/pdf",
        });
        toast.success("Document uploadé avec succès");
        router.push("/documents");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    });
  }

  return (
    <div className="space-y-5 max-w-lg">
      <div className="space-y-2">
        <Label>Fichier PDF *</Label>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_ATTACHMENTS_PRESET}
          options={{
            resourceType: "raw",
            clientAllowedFormats: ["pdf"],
            maxFileSize: 10485760,
          }}
          onSuccess={handleUploadSuccess}
        >
          {({ open }) => (
            <div
              className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors cursor-pointer"
              onClick={() => open()}
            >
              {uploadedFile ? (
                <>
                  <CheckCircleIcon className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {uploadedFile.original_filename}.{uploadedFile.format}
                  </span>
                </>
              ) : (
                <>
                  <UploadIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">Cliquez pour choisir un fichier PDF</span>
                </>
              )}
            </div>
          )}
        </CldUploadWidget>
        <p className="text-xs text-muted-foreground">PDF uniquement · Maximum 10 Mo</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nom du document *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex. CV Développeur Frontend – Avril 2026"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
        <Select value={type} onValueChange={(v) => setType(v as DocumentType)}>
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

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={!uploadedFile || isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
