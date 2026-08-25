import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Slideshow cinematográfico do hero: crossfade lento entre fotos reais da
 * barbearia, com Ken Burns alternado (zoom-in / zoom-out + pan) em cada imagem
 * e leve parallax no scroll. Respeita prefers-reduced-motion e reduz o
 * movimento no mobile.
 */
export function HeroSlideshow({
  images,
  videoUrl,
  intervalMs = 7000,
}: {
  images: { url: string; alt: string }[];
  videoUrl?: string | null;
  intervalMs?: number;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (videoUrl || reduced || images.length < 2) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % images.length),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [videoUrl, reduced, images.length, intervalMs]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const factor = window.innerWidth < 768 ? 0.05 : 0.12;
      const offset = Math.min(window.scrollY, window.innerHeight) * factor;
      layer.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        {videoUrl ? (
          <video
            src={videoUrl}
            poster={images[0]?.url}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          images.map((image, index) => (
            <img
              key={`${image.url}-${index}`}
              src={image.url}
              alt=""
              fetchPriority={index === 0 ? "high" : "low"}
              loading={index === 0 ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out",
                index === active ? "opacity-100" : "opacity-0",
                !reduced && (index % 2 === 0 ? "kb-in" : "kb-out"),
              )}
            />
          ))
        )}
      </div>

      {/* Contraste e legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/90 to-transparent" />
    </div>
  );
}
