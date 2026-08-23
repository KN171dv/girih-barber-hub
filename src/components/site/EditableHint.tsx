import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Marca visualmente um conteúdo ainda não preenchido no painel administrativo. */
export function EditableHint({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded border border-dashed border-primary/40 bg-primary/5 px-2 py-0.5 text-xs italic text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
