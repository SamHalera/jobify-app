"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateCompany } from "@/actions/companies";

interface Props {
  company: { id: string; name: string; website: string | null; notes: string | null };
  onSuccess?: () => void;
}

export function CompanyEditDialog({ company, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateCompany(company.id, formData);
        setOpen(false);
        toast.success("Entreprise mise à jour");
        router.refresh();
        onSuccess?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erreur");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button size="icon" variant="ghost" aria-label="Modifier l'entreprise" />}
      >
        <PencilIcon className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'entreprise</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nom *</Label>
            <Input
              id="edit-name"
              name="name"
              required
              defaultValue={company.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-website">Site web</Label>
            <Input
              id="edit-website"
              name="website"
              type="url"
              placeholder="https://..."
              defaultValue={company.website ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              name="notes"
              placeholder="Secteur, taille, notes..."
              defaultValue={company.notes ?? ""}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
