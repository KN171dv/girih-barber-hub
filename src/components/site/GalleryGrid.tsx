import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryPhoto = { url: string; title: string };

const SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-2",
  "sm:col-span-1",
];

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback(
    (delta: number) =>
      setOpen((current) =>
        current === null ? null : (current + delta + photos.length) % photos.length,
      ),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, move]);

  if (photos.length === 0) return null;
  const active = open === null ? null : photos[open];

  return (
    <>
      <div className="grid auto-rows-[190px] grid-cols-1 gap-3 sm:auto-rows-[210px] sm:grid-cols-3 lg:auto-rows-[240px] lg:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={photo.url}
            type="button"
            onClick={() => setOpen(index)}
            aria-label={`Ampliar foto: ${photo.title}`}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              SPANS[index % SPANS.length],
            )}
          >
            <img
              src={photo.url}
              alt={photo.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
            <span className="absolute bottom-3 left-4 right-4 text-left text-xs uppercase tracking-[0.18em] text-foreground/90">
              {photo.title}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <img
            src={active.url}
            alt={active.title}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] w-auto max-w-full rounded-lg border border-border/60 object-contain"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-surface/80 text-foreground hover:border-primary hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(-1);
            }}
            aria-label="Foto anterior"
            className="absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-surface/80 text-foreground hover:border-primary hover:text-primary sm:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(1);
            }}
            aria-label="Próxima foto"
            className="absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-surface/80 text-foreground hover:border-primary hover:text-primary sm:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <p className="absolute bottom-5 left-0 right-0 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {active.title}
          </p>
        </div>
      )}
    </>
  );
}
