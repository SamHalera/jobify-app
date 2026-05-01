"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import type { ApplicationStatus, ApplicationWithRelations, ApplicationWithCount } from "@/types";

const ApplicationSchema = z.object({
  jobTitle: z.string().min(1, "L'intitulé du poste est requis"),
  companyId: z.string().min(1, "L'entreprise est requise"),
  jobUrl: z.preprocess((v) => (v == null || v === "" ? undefined : v), z.url({ error: "URL invalide" }).optional()),
  location: z.string().optional(),
  salary: z.string().optional(),
  isRemote: z.boolean().optional().default(false),
  status: z.enum(["WISHLIST","APPLIED","IN_PROGRESS","OFFER","ACCEPTED","REJECTED","WITHDRAWN","GHOSTED"] as const).optional().default("WISHLIST"),
  appliedAt: z.string().optional(),
  notes: z.string().optional(),
});

export async function getApplications(filters?: {
  status?: ApplicationStatus;
  companyId?: string;
}): Promise<ApplicationWithCount[]> {
  const user = await requireAuth();
  return prisma.application.findMany({
    where: { userId: user.id, ...filters },
    include: {
      company: true,
      _count: { select: { stages: true, documents: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplicationById(id: string): Promise<ApplicationWithRelations | null> {
  const user = await requireAuth();
  return prisma.application.findUnique({
    where: { id, userId: user.id },
    include: {
      company: true,
      stages: { orderBy: { order: "asc" } },
      documents: { include: { document: true } },
    },
  });
}

export async function createApplication(formData: FormData) {
  const user = await requireAuth();
  const raw = {
    jobTitle: formData.get("jobTitle") as string,
    companyId: formData.get("companyId") as string,
    jobUrl: formData.get("jobUrl") as string,
    location: formData.get("location") as string,
    salary: formData.get("salary") as string,
    isRemote: formData.get("isRemote") === "true",
    status: (formData.get("status") as ApplicationStatus) || "WISHLIST",
    appliedAt: formData.get("appliedAt") as string,
    notes: formData.get("notes") as string,
  };
  const data = ApplicationSchema.parse(raw);

  const application = await prisma.application.create({
    data: {
      jobTitle: data.jobTitle,
      companyId: data.companyId,
      jobUrl: data.jobUrl || null,
      location: data.location || null,
      salary: data.salary || null,
      isRemote: data.isRemote,
      status: data.status,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
      notes: data.notes || null,
      userId: user.id,
    },
  });

  revalidatePath("/applications");
  return application;
}

export async function updateApplication(id: string, formData: FormData) {
  const user = await requireAuth();
  const raw = {
    jobTitle: formData.get("jobTitle") as string,
    companyId: formData.get("companyId") as string,
    jobUrl: formData.get("jobUrl") as string,
    location: formData.get("location") as string,
    salary: formData.get("salary") as string,
    isRemote: formData.get("isRemote") === "true",
    status: formData.get("status") as ApplicationStatus,
    appliedAt: formData.get("appliedAt") as string,
    notes: formData.get("notes") as string,
  };
  const data = ApplicationSchema.parse(raw);

  const application = await prisma.application.update({
    where: { id, userId: user.id },
    data: {
      jobTitle: data.jobTitle,
      companyId: data.companyId,
      jobUrl: data.jobUrl || null,
      location: data.location || null,
      salary: data.salary || null,
      isRemote: data.isRemote,
      status: data.status,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  return application;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const user = await requireAuth();
  const application = await prisma.application.update({
    where: { id, userId: user.id },
    data: { status },
  });
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  return application;
}

export async function deleteApplication(id: string) {
  const user = await requireAuth();
  await prisma.application.delete({ where: { id, userId: user.id } });
  revalidatePath("/applications");
}

export async function getApplicationStats() {
  const user = await requireAuth();
  const [statusCounts, monthly] = await Promise.all([
    prisma.application.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: { status: true },
    }),
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT to_char(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month, COUNT(*) as count
      FROM "Application"
      WHERE "userId" = ${user.id}
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12
    `,
  ]);

  return {
    statusCounts: statusCounts.map((s: { status: ApplicationStatus; _count: { status: number } }) => ({ status: s.status, count: s._count.status })),
    monthly: monthly.map((m: { month: string; count: bigint }) => ({ month: m.month, count: Number(m.count) })),
  };
}
