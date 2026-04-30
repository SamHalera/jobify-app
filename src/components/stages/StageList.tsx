"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StageCard } from "./StageCard";
import { StageForm } from "./StageForm";
import type { RecruitmentStage } from "@/types";

interface Props {
  stages: RecruitmentStage[];
  applicationId: string;
}

export function StageList({ stages, applicationId }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<RecruitmentStage | undefined>();

  function openNew() {
    setEditingStage(undefined);
    setSheetOpen(true);
  }

  function openEdit(stage: RecruitmentStage) {
    setEditingStage(stage);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Étapes de recrutement</h2>
        <Button size="sm" onClick={openNew}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Ajouter une étape
        </Button>
      </div>

      {stages.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
          Aucune étape enregistrée. Ajoutez la première étape du processus de recrutement.
        </p>
      ) : (
        <div className="space-y-2">
          {stages.map((stage) => (
            <StageCard
              key={stage.id}
              stage={stage}
              applicationId={applicationId}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingStage ? "Modifier l'étape" : "Ajouter une étape"}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <StageForm
              applicationId={applicationId}
              stage={editingStage}
              onSuccess={() => setSheetOpen(false)}
              onCancel={() => setSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
