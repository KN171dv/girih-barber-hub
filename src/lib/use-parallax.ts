import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Parallax leve com GSAP ScrollTrigger: desloca o elemento verticalmente
 * conforme a seção passa pela viewport. Use em uma camada de imagem com
 * um pouco de "sobra" (ex.: escala 1.12+) para não revelar bordas.
 * Desativado automaticamente com prefers-reduced-motion.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, amount = 32) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -amount },
        {
          y: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [ref, amount]);
}
