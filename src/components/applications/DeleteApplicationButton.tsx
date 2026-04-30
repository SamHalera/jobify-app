"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteApplication } from "@/actions/applications";

export function DeleteApplicationButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Supprimer cette candidature et toutes ses étapes ?")) return;
    startTransition(async () => {
      try {
        await deleteApplication(id);
        toast.success("Candidature supprimée");
        router.push("/applications");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    });
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isPending}>
      <Trash2Icon className="h-4 w-4 mr-1" />
      Supprimer
    </Button>
  );
}
