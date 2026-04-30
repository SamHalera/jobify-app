"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanySelectWithCreate } from "@/components/companies/CompanySelectWithCreate";
import { createApplication, updateApplication } from "@/actions/applications";
import { STATUS_LABELS } from "@/types";
import type { ApplicationWithRelations, ApplicationStatus } from "@/types";
import type { CompanyWithCount } from "@/types";

const STATUSES = Object.entries(STATUS_LABELS) as [ApplicationStatus, string][];

interface Props {
  companies: CompanyWithCount[];
  application?: ApplicationWithRelations;
}

export function ApplicationForm({ companies, application }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (application) {
          await updateApplication(application.id, formData);
          toast.success("Candidature mise à jour");
          router.push(`/applications/${application.id}`);
        } else {
          const created = await createApplication(formData);
          toast.success("Candidature créée");
          router.push(`/applications/${created.id}`);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Intitulé du poste *</Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            required
            placeholder="ex. Développeur Frontend"
            defaultValue={application?.jobTitle}
          />
        </div>

        <div className="space-y-2">
          <Label>Entreprise *</Label>
          <CompanySelectWithCreate
            initialCompanies={companies}
            defaultValue={application?.companyId}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select name="status" defaultValue={application?.status ?? "WISHLIST"}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appliedAt">Date de candidature</Label>
          <Input
            id="appliedAt"
            name="appliedAt"
            type="date"
            defaultValue={
              application?.appliedAt
                ? new Date(application.appliedAt).toISOString().split("T")[0]
                : ""
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            name="location"
            placeholder="ex. Paris, Lyon, Remote"
            defaultValue={application?.location ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salaire</Label>
          <Input
            id="salary"
            name="salary"
            placeholder="ex. 45k–55k€"
            defaultValue={application?.salary ?? ""}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="jobUrl">URL de l&apos;offre</Label>
          <Input
            id="jobUrl"
            name="jobUrl"
            type="url"
            placeholder="https://..."
            defaultValue={application?.jobUrl ?? ""}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isRemote"
            name="isRemote"
            type="checkbox"
            value="true"
            defaultChecked={application?.isRemote}
            className="h-4 w-4 rounded border border-input"
          />
          <Label htmlFor="isRemote">Télétravail complet</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Informations supplémentaires, contacts, impressions..."
          defaultValue={application?.notes ?? ""}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : application ? "Mettre à jour" : "Créer la candidature"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
