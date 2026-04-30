import { cn } from "@/lib/utils";
import { STATUS_COLORS, STATUS_DOT, STATUS_LABELS } from "@/types";
import type { ApplicationStatus } from "@/types";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
      STATUS_COLORS[status]
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}
