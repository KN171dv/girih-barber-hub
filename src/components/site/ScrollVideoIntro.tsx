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
 * DESKTOP (sem toque, sem prefers-reduced-motion): a seção fica pinada em
 * tela cheia (GSAP ScrollTrigger `pin: true`) enquanto o usuário rola por
 * `scrollDistance` da altura da viewport; nesse intervalo, o progresso do
 * scroll controla o `currentTime` do vídeo.
 *
 * TOQUE (celular/tablet, qualquer largura): usa a MESMA ideia de "vídeo
 * acompanha o scroll", mas SEM pin. `pin: true` usa `position: fixed`
 * internamente, e a combinação de scroll-por-toque com elemento fixo pinado
 * teve comportamento inconsistente entre navegadores/engines mobile (Safari
 * iOS em especial — travamento visual real relatado em produção). Em vez
 * disso, calculamos o progresso "do jeito tradicional": a posição da seção
 * (`getBoundingClientRect().top`) relativa à viewport, sem prender nada — a
 * seção rola normalmente junto com o resto da página. O progresso vai de 0
 * (seção começando a entrar pela base da tela) a 1 (seção saindo pelo topo),
 * e é aplicado ao vídeo no mesmo loop de requestAnimationFrame usado no
 * desktop. Como nada é pinado, não existe `position: fixed` disputando com o
 * scroll nativo do toque — o pior caso possível é o vídeo não acompanhar o
 * scroll perfeitamente (nunca a página travar).
 *
 * `prefers-reduced-motion`: pula qualquer scroll-scrub (pinado ou não) — o
 * vídeo toca sozinho em loop, sem nenhuma animação amarrada ao scroll do
 * usuário.
 *
 * Em todos os casos sem pin, um IntersectionObserver cuida da visibilidade
 * do header fixo (ver src/lib/headerVisibility.ts), revelando-o quando a
 * seção passa a ocupar menos da metade da viewport.
 */
export function ScrollVideoIntro({
  src,
  poster,
  scrollDistance = 1.2,
}: {
  src: string;
  poster?: string;
  /** Distância de scroll pinada (só no desktop), em múltiplos da altura da viewport. */
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
    const isNarrowScreen = window.matchMedia("(max-width: 767px)").matches;
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0 ||
      "ontouchstart" in window;

    // prefers-reduced-motion: nenhuma animação amarrada ao scroll, pinada ou não.
    if (reduced) {
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

    // Toque (celular/tablet) ou tela estreita: scroll-scrub SEM pin.
    if (isNarrowScreen || isTouchDevice) {
      let rafId = 0;
      let targetProgress = 0;

      function computeProgress() {
        if (!section) return 0;
        const rect = section.getBoundingClientRect();
        // Essa seção é sempre a primeira coisa da página (nada acima dela
        // pra "entrar pela base da tela"), então o progresso é simplesmente
        // o quanto ela já rolou pra fora do topo da viewport: 0 no início
        // (topo da seção = topo da viewport, vídeo no primeiro frame) até 1
        // quando ela termina de sair (sem reservar espaço extra de scroll,
        // já que não há pin — a "distância" do efeito é a própria altura da
        // seção).
        const raw = -rect.top / rect.height;
        return Math.min(1, Math.max(0, raw));
      }

      function onScrollOrResize() {
        targetProgress = computeProgress();
        setHeaderVisible(targetProgress > 0.92);
      }

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
        // "Prime" o decoder antes de depender só de seeks manuais: alguns
        // navegadores mobile (Safari iOS em especial) não decodificam/exibem
        // nenhum frame de um <video> que nunca chegou a tocar, mesmo
        // definindo currentTime diretamente — um play()+pause() rápido
        // resolve isso sem o usuário perceber.
        video
          .play()
          .then(() => video.pause())
          .catch(() => video.pause());
        onScrollOrResize();
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);
        rafId = requestAnimationFrame(tick);
      }

      if (video.readyState >= 1) setup();
      else video.addEventListener("loadedmetadata", setup, { once: true });

      return () => {
        video.removeEventListener("loadedmetadata", setup);
        window.removeEventListener("scroll", onScrollOrResize);
        window.removeEventListener("resize", onScrollOrResize);
        if (rafId) cancelAnimationFrame(rafId);
        setHeaderVisible(true);
      };
    }

    // Desktop: scroll-scrub pinado (ScrollTrigger).
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
