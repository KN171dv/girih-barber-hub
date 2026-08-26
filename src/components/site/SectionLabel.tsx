import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Cabeçalho de seção com numeração discreta e linha dourada.
 *  No mobile fica centralizado; a partir de sm volta ao alinhamento definido. */
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
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mx-auto max-w-2xl text-center",
        centered ? "sm:text-center" : "sm:mx-0 sm:text-left",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-3",
          !centered && "sm:justify-start",
        )}
      >
        {index && (
          <span className="font-mono text-xs tracking-[0.3em] text-primary/70">{index}</span>
        )}
        <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="mt-3 text-[1.9rem] leading-[1.08] sm:mt-4 sm:text-4xl lg:text-5xl">{title}</h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
