"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCompany } from "@/actions/companies";
import type { CompanyWithCount } from "@/types";

interface Props {
  initialCompanies: CompanyWithCount[];
  defaultValue?: string;
}

type Option = { value: string; label: string };

function toOption(company: CompanyWithCount): Option {
  return { value: company.id, label: company.name };
}

export function CompanySelectWithCreate({ initialCompanies, defaultValue }: Props) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [selected, setSelected] = useState<Option | null>(
    defaultValue
      ? (initialCompanies.find((c) => c.id === defaultValue)
          ? { value: defaultValue, label: initialCompanies.find((c) => c.id === defaultValue)!.name }
          : null)
      : null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      try {
        const company = await createCompany(formData);
        const newOption = toOption({ ...company, _count: { applications: 0 } });
        setCompanies((prev) => [...prev, { ...company, _count: { applications: 0 } }]);
        setSelected(newOption);
        setDialogOpen(false);
        toast.success(`Entreprise "${company.name}" créée et sélectionnée`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la création");
      }
    });
  }

  return (
    <div className="flex gap-2">
      {/* hidden input — c'est lui qui soumet le companyId au Server Action */}
      <input type="hidden" name="companyId" value={selected?.value ?? ""} />

      <Select
        value={selected}
        onValueChange={(v: Option | null) => setSelected(v)}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Choisir une entreprise" />
        </SelectTrigger>
        <SelectContent>
          {companies.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              Aucune entreprise. Créez-en une avec le bouton &quot;+&quot;.
            </div>
          ) : (
            companies.map((c) => (
              <SelectItem key={c.id} value={toOption(c)}>
                {c.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger
          title="Créer une nouvelle entreprise"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une entreprise</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nom *</Label>
              <Input
                id="company-name"
                name="name"
                required
                autoFocus
                placeholder="ex. Anthropic"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-website">Site web</Label>
              <Input
                id="company-website"
                name="website"
                type="url"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-notes">Notes</Label>
              <Input
                id="company-notes"
                name="notes"
                placeholder="Secteur, taille..."
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Création..." : "Créer et sélectionner"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
