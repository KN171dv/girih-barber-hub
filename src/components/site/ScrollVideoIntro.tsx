import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setHeaderVisible } from "@/lib/headerVisibility";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fase 1 — introdução em vídeo, antes do Hero, sem nenhum texto por cima.
 *
 * A seção fica pinada em tela cheia (GSAP ScrollTrigger `pin: true`) enquanto
 * o usuário rola por `scrollDistance` da altura da viewport; nesse intervalo,
 * o progresso do scroll controla o `currentTime` do vídeo — o vídeo "para"
 * no primeiro frame até o usuário começar a rolar, e termina no último frame
 * quando o pin solta e a página segue pro Hero de verdade.
 *
 * Fluidez: `scrub: 1` já suaviza o progresso do ScrollTrigger (com um pouco
 * de inércia em vez de seguir o scroll cru 1:1); além disso, a atualização de
 * `currentTime` é aplicada via requestAnimationFrame (no máximo uma vez por
 * quadro, com deduplicação) em vez de direto no callback do ScrollTrigger,
 * pra não empilhar seeks. O vídeo em si também foi recodificado com um
 * keyframe por frame — sem isso, o navegador precisa decodificar vários
 * quadros anteriores a cada seek, o que é a causa mais comum de "engasgo"
 * nesse tipo de efeito (mais impactante que o valor de scrub em si).
 *
 * No mobile e com prefers-reduced-motion, pula o pin/scrub: o vídeo toca
 * sozinho em loop e a seção rola normalmente, como qualquer outra — pin +
 * scrub de vídeo têm suporte inconsistente em navegadores mobile (Safari
 * iOS em especial) e a interação de "segurar a tela rolando" é bem menos
 * natural em toque do que com mouse/trackpad.
 *
 * O header fixo do site fica escondido (ver src/lib/headerVisibility.ts)
 * enquanto essa seção domina a tela — sem pin (desktop) isso é decidido pelo
 * próprio ScrollTrigger (some ao montar, volta quando o pin solta); no
 * fallback mobile/reduced-motion, um IntersectionObserver cumpre o mesmo
 * papel, revelando o header quando a seção passa a ocupar menos da metade
 * da viewport.
 */
export function ScrollVideoIntro({
  src,
  poster,
  scrollDistance = 1.2,
}: {
  src: string;
  poster?: string;
  /** Distância de scroll pinada, em múltiplos da altura da viewport. */
  scrollDistance?: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Roda antes da primeira pintura do navegador — evita um flash do header
  // visível por uma fração de segundo antes de sumir (useEffect normal só
  // dispara depois do primeiro paint).
  useIsomorphicLayoutEffect(() => {
    setHeaderVisible(false);
    return () => setHeaderVisible(true);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (reduced || isMobile) {
      video.loop = true;
      video.play().catch(() => {
        /* autoplay pode ser bloqueado antes de qualquer interação; o poster cobre o vazio */
      });

      const observer = new IntersectionObserver(
        ([entry]) => entry && setHeaderVisible(entry.intersectionRatio < 0.5),
        { threshold: [0, 0.5, 1] },
      );
      observer.observe(section);

      return () => {
        observer.disconnect();
        setHeaderVisible(true);
      };
    }

    let trigger: ScrollTrigger | undefined;
    let rafId = 0;
    let targetProgress = 0;

    function tick() {
      if (video && video.duration) {
        const targetTime = targetProgress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.01) {
          video.currentTime = targetTime;
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    function setup() {
      if (!video) return;
      video.pause();
      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * scrollDistance}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
        // Header só aparece quando o pin solta (fim da Fase 1); volta a
        // sumir se o usuário rolar de volta pra dentro da introdução.
        onLeave: () => setHeaderVisible(true),
        onEnterBack: () => setHeaderVisible(false),
      });
      rafId = requestAnimationFrame(tick);
    }

    if (video.readyState >= 1) setup();
    else video.addEventListener("loadedmetadata", setup, { once: true });

    return () => {
      video.removeEventListener("loadedmetadata", setup);
      if (rafId) cancelAnimationFrame(rafId);
      trigger?.kill();
      setHeaderVisible(true);
    };
  }, [scrollDistance]);

  return (
    <div
      ref={sectionRef}
      className="relative isolate h-[100svh] w-full overflow-hidden bg-background"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
