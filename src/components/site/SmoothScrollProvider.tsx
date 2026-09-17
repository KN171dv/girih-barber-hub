import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Smooth scroll (Lenis) sincronizado com GSAP ScrollTrigger, e MotionConfig
 * global respeitando prefers-reduced-motion para todas as animações
 * Framer Motion do site público. Só ativa o scroll suave no client e
 * desliga automaticamente se o usuário pedir menos movimento.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
      // Sem isso, o toque faz scroll "nativo" (passthrough) em vez de
      // passar pelo loop do Lenis — é exatamente o que quebra a sincronia
      // com o pin do GSAP ScrollTrigger em touch (o vídeo trava/reseta
      // porque o ScrollTrigger não fica sabendo do progresso do toque no
      // mesmo ritmo que sabe do wheel). Com `syncTouch`, toque passa pelo
      // mesmo loop de scroll do wheel, mantendo tudo sincronizado.
      syncTouch: true,
      syncTouchLerp: 0.075,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
