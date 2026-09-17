import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setHeaderVisible } from "@/lib/headerVisibility";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Mode = "reduced" | "touch" | "desktop";

function getMode(): Mode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  const isNarrowScreen = window.matchMedia("(max-width: 767px)").matches;
  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window;
  return isNarrowScreen || isTouchDevice ? "touch" : "desktop";
}

/**
 * Fase 1 — introdução em vídeo, antes do Hero, sem nenhum texto por cima.
 *
 * DESKTOP (sem toque, sem prefers-reduced-motion): a seção fica pinada em
 * tela cheia (GSAP ScrollTrigger `pin: true`) enquanto o usuário rola por
 * `scrollDistance` da altura da viewport; nesse intervalo, o progresso do
 * scroll controla o `currentTime` do vídeo.
 *
 * TOQUE (celular/tablet, qualquer largura): precisa da mesma sensação de
 * "segura a tela por um scroll mais longo antes de liberar o resto da
 * página", mas SEM `pin: true`/`position: fixed` via JS — essa combinação
 * com scroll por toque teve comportamento inconsistente entre engines mobile
 * (Safari iOS em especial — travamento visual real relatado em produção).
 * Em vez disso, usa `position: sticky` NATIVO do CSS, que o próprio navegador
 * gerencia (não uma disputa de JS por cima do toque):
 *
 *   - O wrapper externo (`sectionRef`) é esticado para `mobileScrollHeightVh`
 *     (250vh por padrão) SÓ nesse modo — via `style.height` aplicado no
 *     client, nunca via classe CSS fixa, porque a altura tem que nascer
 *     exatamente do mesmo `getMode()` que decide qual branch de JS roda (ver
 *     nota abaixo sobre isso).
 *   - Dentro dele, um segundo `div` com `position: sticky; top: 0` preenche
 *     a viewport (`100svh`) e "gruda" no topo enquanto o usuário rola pelo
 *     wrapper alto — comportamento nativo do navegador, sem JS brigando com
 *     o gesto de toque.
 *   - O progresso do scroll é calculado como `-rect.top / (rect.height -
 *     viewportHeight)`: 0 quando o topo do wrapper alcança o topo da
 *     viewport (vídeo gruda e começa no primeiro frame), 1 quando o wrapper
 *     termina de rolar por baixo do vídeo grudado (ele solta e a página
 *     segue pro resto do conteúdo). Aplicado ao vídeo no mesmo loop de
 *     requestAnimationFrame usado no desktop.
 *
 * Importante: o wrapper só fica alto quando `getMode()` (chamado uma vez,
 * antes da pintura) diz "touch" — no modo desktop ou reduced-motion ele
 * continua com exatamente 1 viewport de altura (o `sticky` vira um no-op
 * quando pai e filho têm a mesma altura), então nada muda pra esses casos.
 *
 * `prefers-reduced-motion`: pula qualquer scroll-scrub (pinado, sticky ou
 * não) — o vídeo toca sozinho em loop, sem nenhuma animação amarrada ao
 * scroll do usuário.
 *
 * Em todos os casos sem pin do GSAP, um IntersectionObserver ou o próprio
 * cálculo de progresso cuidam da visibilidade do header fixo (ver
 * src/lib/headerVisibility.ts).
 */
export function ScrollVideoIntro({
  src,
  poster,
  scrollDistance = 1.2,
  mobileScrollHeightVh = 250,
}: {
  src: string;
  poster?: string;
  /** Distância de scroll pinada (só no desktop), em múltiplos da altura da viewport. */
  scrollDistance?: number;
  /** Altura do wrapper sticky no celular, em vh — controla por quanto tempo de scroll o vídeo fica preso na tela. */
  mobileScrollHeightVh?: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Roda antes da primeira pintura do navegador — evita tanto o flash do
  // header visível quanto um "pulo" de altura do wrapper (100svh -> alto)
  // depois que a página já apareceu pro usuário.
  useIsomorphicLayoutEffect(() => {
    setHeaderVisible(false);
    const section = sectionRef.current;
    if (section && getMode() === "touch") {
      section.style.height = `${mobileScrollHeightVh}vh`;
    }
    return () => setHeaderVisible(true);
  }, [mobileScrollHeightVh]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const mode = getMode();

    // prefers-reduced-motion: nenhuma animação amarrada ao scroll, pinada ou não.
    if (mode === "reduced") {
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

    // Toque (celular/tablet) ou tela estreita: scroll-scrub via position: sticky nativo.
    if (mode === "touch") {
      let rafId = 0;
      let targetProgress = 0;

      function computeProgress() {
        if (!section) return 0;
        const rect = section.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return 0;
        // 0 quando o topo do wrapper alto alcança o topo da viewport (o
        // vídeo, grudado por `position: sticky`, começa no primeiro frame),
        // 1 quando o wrapper termina de rolar por baixo dele (solta e a
        // página segue pro resto do conteúdo).
        const raw = -rect.top / scrollable;
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
    <div ref={sectionRef} className="relative isolate h-[100svh] w-full bg-background">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
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
    </div>
  );
}
