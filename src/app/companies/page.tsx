"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { BuildingIcon, PlusIcon, TrashIcon, GlobeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createCompany, deleteCompany, getCompanies } from "@/actions/companies";
import { CompanyEditDialog } from "@/components/companies/CompanyEditDialog";
import type { CompanyWithCount } from "@/types";
import { useEffect } from "react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithCount[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getCompanies().then(setCompanies);
  }, []);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      try {
        console.log("formData==>", formData)
        await createCompany(formData);
        const updated = await getCompanies();
        setCompanies(updated);
        setOpen(false);
        toast.success("Entreprise créée");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur");
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    startTransition(async () => {
      try {
        await deleteCompany(id);
        setCompanies((prev) => prev.filter((c) => c.id !== id));
        toast.success("Entreprise supprimée");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Entreprises</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {companies.length} entreprise{companies.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            <PlusIcon className="h-4 w-4" />
            Nouvelle entreprise
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une entreprise</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input id="name" name="name" required placeholder="ex. Anthropic" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input id="website" name="website" type="url" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" name="notes" placeholder="Secteur, taille, notes..." />
              </div>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Création..." : "Créer l'entreprise"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-20 border rounded-lg border-dashed">
          <BuildingIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune entreprise. Créez-en une pour commencer.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/companies/${company.id}`}
                  className="font-semibold hover:underline block truncate"
                >
                  {company.name}
                </Link>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>
                    {company._count.applications} candidature{company._count.applications !== 1 ? "s" : ""}
                  </span>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-0.5 hover:text-foreground"
                    >
                      <GlobeIcon className="h-3 w-3" />
                      Site
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <CompanyEditDialog
                  company={company}
                  onSuccess={() => getCompanies().then(setCompanies)}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(company.id, company.name)}
                  disabled={isPending}
                >
                  <TrashIcon className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
