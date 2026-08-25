import { useEffect, useRef } from "react";

/**
 * Fundo do hero com movimento contínuo (Ken Burns) e parallax leve no scroll.
 * Respeita prefers-reduced-motion e reduz a intensidade no mobile.
 */
export function HeroBackdrop({ src, alt }: { src: string; alt: string }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const isMobile = window.innerWidth < 768;
      const factor = isMobile ? 0.05 : 0.12;
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
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        <img
          src={src}
          alt={alt}
          fetchPriority="high"
          className="ken-burns h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/88 to-background/45" />
      <div className="absolute inset-0 bg-background/25" />
    </div>
  );
}
