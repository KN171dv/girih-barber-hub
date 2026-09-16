import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

/** Comparador antes/depois com transição suave via arraste (mouse, touch e teclado). */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Antes",
  afterLabel = "Depois",
  alt,
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
}) {
  const [percent, setPercent] = useState(50);

  return (
    <div className="group relative aspect-[4/5] w-full select-none overflow-hidden rounded-2xl border border-border/70 sm:aspect-[16/11]">
      <img
        src={after}
        alt={`${alt} — depois`}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden transition-[clip-path] duration-150 ease-out"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        <img
          src={before}
          alt={`${alt} — antes`}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 flex items-center transition-[left] duration-150 ease-out"
        style={{ left: `${percent}%` }}
      >
        <span className="h-full w-px bg-primary/70" aria-hidden="true" />
        <span className="absolute grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-primary/60 bg-background/90 text-primary shadow-gold transition-transform duration-300 group-hover:scale-110">
          <ChevronsLeftRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={percent}
        onChange={(event) => setPercent(Number(event.target.value))}
        aria-label={`Comparar antes e depois: ${alt}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />

      <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-primary/40 bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur">
        {afterLabel}
      </span>
    </div>
  );
}
