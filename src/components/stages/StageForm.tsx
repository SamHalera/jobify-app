"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addStage, updateStage } from "@/actions/stages";
import { STAGE_TYPE_LABELS, STAGE_OUTCOME_LABELS } from "@/types";
import type { RecruitmentStage, StageType, StageOutcome } from "@/types";

const TYPES = Object.entries(STAGE_TYPE_LABELS) as [StageType, string][];
const OUTCOMES = Object.entries(STAGE_OUTCOME_LABELS) as [StageOutcome, string][];

interface Props {
  applicationId: string;
  stage?: RecruitmentStage;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StageForm({ applicationId, stage, onSuccess, onCancel }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (stage) {
          await updateStage(stage.id, applicationId, formData);
          toast.success("Étape mise à jour");
        } else {
          await addStage(applicationId, formData);
          toast.success("Étape ajoutée");
        }
        onSuccess();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Type d&apos;étape *</Label>
          <Select name="type" defaultValue={stage?.type ?? "INTERVIEW"} required>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="outcome">Résultat</Label>
          <Select name="outcome" defaultValue={stage?.outcome ?? "PENDING"}>
            <SelectTrigger id="outcome">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OUTCOMES.map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="ex. Entretien RH - Sarah"
            defaultValue={stage?.title}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduledAt">Date prévue</Label>
          <Input
            id="scheduledAt"
            name="scheduledAt"
            type="date"
            defaultValue={stage?.scheduledAt ? new Date(stage.scheduledAt).toISOString().split("T")[0] : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="completedAt">Date de fin</Label>
          <Input
            id="completedAt"
            name="completedAt"
            type="date"
            defaultValue={stage?.completedAt ? new Date(stage.completedAt).toISOString().split("T")[0] : ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Questions posées, impressions, points à retenir..."
          defaultValue={stage?.notes ?? ""}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : stage ? "Mettre à jour" : "Ajouter l'étape"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
