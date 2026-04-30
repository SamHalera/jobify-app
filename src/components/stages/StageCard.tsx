"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CalendarIcon, CheckCircle2Icon, XCircleIcon, ClockIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteStage } from "@/actions/stages";
import { STAGE_TYPE_LABELS, STAGE_OUTCOME_LABELS } from "@/types";
import { formatDate, cn } from "@/lib/utils";
import type { RecruitmentStage, StageOutcome } from "@/types";

const OUTCOME_CONFIG: Record<StageOutcome, { icon: React.ElementType; label: string; classes: string; dot: string }> = {
  PENDING:   { icon: ClockIcon,        label: STAGE_OUTCOME_LABELS.PENDING,   classes: "border-amber-100   bg-amber-50   text-amber-700",  dot: "bg-amber-400" },
  PASSED:    { icon: CheckCircle2Icon, label: STAGE_OUTCOME_LABELS.PASSED,    classes: "border-emerald-100 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  FAILED:    { icon: XCircleIcon,      label: STAGE_OUTCOME_LABELS.FAILED,    classes: "border-red-100     bg-red-50     text-red-600",     dot: "bg-red-500" },
  CANCELLED: { icon: XCircleIcon,      label: STAGE_OUTCOME_LABELS.CANCELLED, classes: "border-zinc-100   bg-zinc-50    text-zinc-500",    dot: "bg-zinc-400" },
};

interface Props {
  stage: RecruitmentStage;
  applicationId: string;
  onEdit: (stage: RecruitmentStage) => void;
}

export function StageCard({ stage, applicationId, onEdit }: Props) {
  const [isPending, startTransition] = useTransition();
  const config = OUTCOME_CONFIG[stage.outcome];
  const Icon = config.icon;

  function handleDelete() {
    if (!confirm("Supprimer cette étape ?")) return;
    startTransition(async () => {
      try {
        await deleteStage(stage.id, applicationId);
        toast.success("Étape supprimée");
      } catch {
        toast.error("Erreur lors de la suppression");
      }
    });
  }

  return (
    <div className={cn("rounded-xl border p-4 transition-shadow hover:card-shadow", config.classes)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Type + outcome */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest opacity-60">
              {STAGE_TYPE_LABELS[stage.type]}
            </span>
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-current/20")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
              {config.label}
            </span>
          </div>

          {/* Title */}
          <p className="font-semibold leading-snug">{stage.title}</p>

          {/* Dates */}
          <div className="flex flex-wrap gap-3 text-xs mt-2 opacity-70">
            {stage.scheduledAt && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                Prévu le {formatDate(stage.scheduledAt)}
              </span>
            )}
            {stage.completedAt && (
              <span className="flex items-center gap-1">
                <CheckCircle2Icon className="h-3 w-3" />
                Terminé le {formatDate(stage.completedAt)}
              </span>
            )}
          </div>

          {/* Notes */}
          {stage.notes && (
            <p className="text-xs mt-2 opacity-70 line-clamp-2 leading-relaxed">{stage.notes}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 shrink-0">
          <Button size="icon" variant="ghost" className="h-7 w-7 opacity-60 hover:opacity-100" onClick={() => onEdit(stage)}>
            <PencilIcon className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7 opacity-60 hover:opacity-100 hover:text-destructive" onClick={handleDelete} disabled={isPending}>
            <Trash2Icon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
