"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import type { CompanyWithCount } from "@/types";

const optionalUrl = z.preprocess(
  (v) => (v == null || v === "" ? undefined : v),
  z.url({ error: "URL invalide" }).optional()
);

const CompanySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  website: optionalUrl,
  logoUrl: optionalUrl,
  notes: z.preprocess((v) => v ?? undefined, z.string().optional()),
});

export async function getCompanies(): Promise<CompanyWithCount[]> {
  const user = await requireAuth();
  return prisma.company.findMany({
    where: { userId: user.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getCompanyById(id: string) {
  const user = await requireAuth();
  return prisma.company.findUnique({
    where: { id, userId: user.id },
    include: {
      applications: {
        include: { company: true, _count: { select: { stages: true, documents: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { applications: true } },
    },
  });
}

export async function createCompany(formData: FormData) {
  const user = await requireAuth();
  const raw = {
    name: formData.get("name") as string,
    website: formData.get("website") as string,
    logoUrl: formData.get("logoUrl") as string,
    notes: formData.get("notes") as string,
  };
  const data = CompanySchema.parse(raw);

  const company = await prisma.company.create({
    data: {
      name: data.name,
      website: data.website || null,
      logoUrl: data.logoUrl || null,
      notes: data.notes || null,
      userId: user.id,
    },
  });

  revalidatePath("/companies");
  return company;
}

export async function updateCompany(id: string, formData: FormData) {
  const user = await requireAuth();
  const raw = {
    name: formData.get("name") as string,
    website: formData.get("website") as string,
    logoUrl: formData.get("logoUrl") as string,
    notes: formData.get("notes") as string,
  };
  const data = CompanySchema.parse(raw);

  const company = await prisma.company.update({
    where: { id, userId: user.id },
    data: {
      name: data.name,
      website: data.website || null,
      logoUrl: data.logoUrl || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/companies");
  revalidatePath(`/companies/${id}`);
  return company;
}

export async function deleteCompany(id: string) {
  const user = await requireAuth();
  const count = await prisma.application.count({ where: { companyId: id, userId: user.id } });
  if (count > 0) {
    throw new Error("Impossible de supprimer une entreprise avec des candidatures actives");
  }
  await prisma.company.delete({ where: { id, userId: user.id } });
  revalidatePath("/companies");
}
