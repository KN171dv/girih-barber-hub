import { Globe, MessageCircle, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SOURCE_LABEL,
  STATUS_CLASS,
  STATUS_LABEL,
  type AppointmentSource,
  type AppointmentStatus,
} from "@/lib/booking";

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        STATUS_CLASS[status] ?? STATUS_CLASS.pendente,
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

const SOURCE_ICON = {
  site: Globe,
  whatsapp: MessageCircle,
  manual: PencilLine,
} as const;

export function SourceBadge({ source }: { source: AppointmentSource }) {
  const Icon = SOURCE_ICON[source] ?? PencilLine;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[11px] text-muted-foreground">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {SOURCE_LABEL[source] ?? source}
    </span>
  );
}
