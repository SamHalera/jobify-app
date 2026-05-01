"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { deleteCloudinaryFile } from "@/lib/upload";
import type { DocumentType } from "@/types";

const DocumentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(["CV", "COVER_LETTER", "OTHER"] as const),
});

export async function getDocuments() {
  const user = await requireAuth();
  return prisma.document.findMany({
    where: { userId: user.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocumentById(id: string) {
  const user = await requireAuth();
  return prisma.document.findUnique({
    where: { id, userId: user.id },
    include: {
      applications: { include: { application: { include: { company: true } } } },
    },
  });
}

export async function createDocumentRecord(input: {
  name: string;
  type: DocumentType;
  publicId: string;
  source: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
}) {
  const user = await requireAuth();
  const data = DocumentSchema.parse({ name: input.name, type: input.type });

  const document = await prisma.document.create({
    data: {
      name: data.name,
      type: data.type,
      fileName: input.fileName,
      publicId: input.publicId,
      source: input.source,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      userId: user.id,
    },
  });

  revalidatePath("/documents");
  return document;
}

export async function deleteDocument(id: string) {
  const user = await requireAuth();
  const doc = await prisma.document.findUniqueOrThrow({ where: { id, userId: user.id } });
  await prisma.document.delete({ where: { id } });
  await deleteCloudinaryFile(doc.publicId);
  revalidatePath("/documents");
}

export async function attachDocumentToApplication(applicationId: string, documentId: string) {
  const user = await requireAuth();
  await prisma.application.findUniqueOrThrow({ where: { id: applicationId, userId: user.id } });
  await prisma.applicationDocument.create({ data: { applicationId, documentId } });
  revalidatePath(`/applications/${applicationId}`);
}

export async function detachDocumentFromApplication(applicationId: string, documentId: string) {
  const user = await requireAuth();
  await prisma.application.findUniqueOrThrow({ where: { id: applicationId, userId: user.id } });
  await prisma.applicationDocument.delete({
    where: { applicationId_documentId: { applicationId, documentId } },
  });
  revalidatePath(`/applications/${applicationId}`);
}
