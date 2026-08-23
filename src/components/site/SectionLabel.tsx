import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Cabeçalho de seção com numeração discreta e linha dourada. */
export function SectionLabel({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          align === "center" && "justify-center",
        )}
      >
        {index && (
          <span className="font-mono text-xs tracking-[0.3em] text-primary/70">{index}</span>
        )}
        <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="mt-4 text-4xl leading-[1.05] sm:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
