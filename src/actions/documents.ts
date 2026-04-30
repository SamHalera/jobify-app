"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { saveFile, deleteFile } from "@/lib/upload";
import type { DocumentType } from "@/types";

const DocumentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(["CV", "COVER_LETTER", "OTHER"] as const),
});

export async function getDocuments() {
  return prisma.document.findMany({
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({
    where: { id },
    include: {
      applications: { include: { application: { include: { company: true } } } },
    },
  });
}

export async function uploadDocument(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("Aucun fichier fourni");

  const raw = {
    name: formData.get("name") as string,
    type: formData.get("type") as DocumentType,
  };
  const data = DocumentSchema.parse(raw);

  const { storagePath, fileName, sizeBytes, mimeType } = await saveFile(file);

  const document = await prisma.document.create({
    data: {
      name: data.name,
      type: data.type,
      fileName,
      storagePath,
      mimeType,
      sizeBytes,
    },
  });

  revalidatePath("/documents");
  return document;
}

export async function deleteDocument(id: string) {
  const doc = await prisma.document.findUniqueOrThrow({ where: { id } });
  await prisma.document.delete({ where: { id } });
  await deleteFile(doc.storagePath);
  revalidatePath("/documents");
}

export async function attachDocumentToApplication(applicationId: string, documentId: string) {
  await prisma.applicationDocument.create({ data: { applicationId, documentId } });
  revalidatePath(`/applications/${applicationId}`);
}

export async function detachDocumentFromApplication(applicationId: string, documentId: string) {
  await prisma.applicationDocument.delete({
    where: { applicationId_documentId: { applicationId, documentId } },
  });
  revalidatePath(`/applications/${applicationId}`);
}
