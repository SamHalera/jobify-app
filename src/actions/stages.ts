"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { StageType, StageOutcome } from "@/types";

const StageSchema = z.object({
  type: z.enum(["SCREENING","TECHNICAL_TEST","INTERVIEW","CASE_STUDY","REFERENCE_CHECK","OFFER_NEGOTIATION","OTHER"] as const),
  title: z.string().min(1, "Le titre est requis"),
  scheduledAt: z.string().optional(),
  completedAt: z.string().optional(),
  outcome: z.enum(["PENDING","PASSED","FAILED","CANCELLED"] as const).optional().default("PENDING"),
  notes: z.string().optional(),
});

export async function addStage(applicationId: string, formData: FormData) {
  const raw = {
    type: formData.get("type") as StageType,
    title: formData.get("title") as string,
    scheduledAt: formData.get("scheduledAt") as string,
    completedAt: formData.get("completedAt") as string,
    outcome: (formData.get("outcome") as StageOutcome) || "PENDING",
    notes: formData.get("notes") as string,
  };
  const data = StageSchema.parse(raw);

  const maxOrder = await prisma.recruitmentStage.aggregate({
    where: { applicationId },
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? -1) + 1;

  const stage = await prisma.recruitmentStage.create({
    data: {
      applicationId,
      type: data.type,
      title: data.title,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
      outcome: data.outcome,
      notes: data.notes || null,
      order,
    },
  });

  revalidatePath(`/applications/${applicationId}`);
  return stage;
}

export async function updateStage(id: string, applicationId: string, formData: FormData) {
  const raw = {
    type: formData.get("type") as StageType,
    title: formData.get("title") as string,
    scheduledAt: formData.get("scheduledAt") as string,
    completedAt: formData.get("completedAt") as string,
    outcome: formData.get("outcome") as StageOutcome,
    notes: formData.get("notes") as string,
  };
  const data = StageSchema.parse(raw);

  const stage = await prisma.recruitmentStage.update({
    where: { id },
    data: {
      type: data.type,
      title: data.title,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
      outcome: data.outcome,
      notes: data.notes || null,
    },
  });

  revalidatePath(`/applications/${applicationId}`);
  return stage;
}

export async function deleteStage(id: string, applicationId: string) {
  await prisma.recruitmentStage.delete({ where: { id } });
  revalidatePath(`/applications/${applicationId}`);
}

export async function reorderStages(applicationId: string, orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, order) =>
      prisma.recruitmentStage.update({ where: { id }, data: { order } })
    )
  );
  revalidatePath(`/applications/${applicationId}`);
}
