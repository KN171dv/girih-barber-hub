import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setHeaderVisible } from "@/lib/headerVisibility";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

// Some assim que o progresso da Fase 1 passa disso — "nos primeiros 5-10%".
const HINT_HIDE_AT = 0.08;

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
 * Desempenho no toque: aparelhos mais fracos engasgam (não travam, apenas
 * soluçam) se o vídeo grande de desktop for decodificado a cada seek. Duas
 * mitigações: (1) `mobileSrc`, quando informado, troca pra uma versão bem
 * mais leve (resolução/bitrate menores) só no modo toque — decodificar
 * menos pixels por quadro é o que mais pesa na CPU; (2) o loop de seek do
 * modo toque limita a taxa de `currentTime` de forma ADAPTATIVA — mede o
 * tempo real entre quadros do rAF e só reduz a taxa de seek se o aparelho
 * de fato estiver demorando mais que o esperado, em vez de aplicar um teto
 * fixo conservador pra todo mundo (ver `FAST_SEEK_INTERVAL_MS`/
 * `SLOW_SEEK_INTERVAL_MS` logo abaixo).
 *
 * `prefers-reduced-motion`: pula qualquer scroll-scrub (pinado, sticky ou
 * não) — o vídeo toca sozinho em loop, sem nenhuma animação amarrada ao
 * scroll do usuário.
 *
 * Em todos os casos sem pin do GSAP, um IntersectionObserver ou o próprio
 * cálculo de progresso cuidam da visibilidade do header fixo (ver
 * src/lib/headerVisibility.ts).
 *
 * Dica de scroll: no primeiro instante (progresso <= `HINT_HIDE_AT`), um
 * indicador discreto ("Role para explorar" + seta) avisa que a seção reage
 * ao scroll — some suavemente assim que o progresso passa disso, nos dois
 * modos (touch e desktop), e nunca aparece com prefers-reduced-motion.
 */
export function ScrollVideoIntro({
  src,
  mobileSrc,
  poster,
  scrollDistance = 1.2,
  mobileScrollHeightVh = 250,
}: {
  src: string;
  /** Versão mais leve (menor resolução/bitrate) servida só no modo toque — decodificar um vídeo grande a cada seek pesa em aparelhos mais fracos. */
  mobileSrc?: string;
  poster?: string;
  /** Distância de scroll pinada (só no desktop), em múltiplos da altura da viewport. */
  scrollDistance?: number;
  /** Altura do wrapper sticky no celular, em vh — controla por quanto tempo de scroll o vídeo fica preso na tela. */
  mobileScrollHeightVh?: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Roda antes da primeira pintura do navegador — evita tanto o flash do
  // header visível quanto um "pulo" de altura do wrapper (100svh -> alto)
  // depois que a página já apareceu pro usuário.
  useIsomorphicLayoutEffect(() => {
    setHeaderVisible(false);
    const section = sectionRef.current;
    const video = videoRef.current;
    const mode = getMode();
    if (section && mode === "touch") {
      section.style.height = `${mobileScrollHeightVh}vh`;
      if (video && mobileSrc) {
        video.src = mobileSrc;
        video.load();
      }
    }
    // Evita o flash da dica de scroll pra quem já pediu menos movimento —
    // nesse modo ela nunca é revelada por scroll mesmo (ver useEffect abaixo).
    if (mode === "reduced" && hintRef.current) {
      hintRef.current.style.opacity = "0";
    }
    return () => setHeaderVisible(true);
  }, [mobileScrollHeightVh, mobileSrc]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const mode = getMode();

    // Escreve o opacity direto no DOM (sem estado do React) pra não
    // re-renderizar a cada quadro — só troca de fato quando cruza o limiar,
    // no mesmo espírito do setHeaderVisible.
    let hintShown = true;
    function updateHint(progress: number) {
      const shouldShow = progress <= HINT_HIDE_AT;
      if (shouldShow === hintShown) return;
      hintShown = shouldShow;
      if (hintRef.current) hintRef.current.style.opacity = shouldShow ? "1" : "0";
    }

    // prefers-reduced-motion: nenhuma animação amarrada ao scroll, pinada ou não —
    // a dica de "role para explorar" também some, já que rolar não muda nada
    // no vídeo nesse modo (ele já toca sozinho em loop).
    if (mode === "reduced") {
      if (hintRef.current) hintRef.current.style.opacity = "0";
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
      let lastSeekAt = 0;
      let lastTickAt = 0;
      // Média móvel do intervalo real entre quadros — começa otimista (60fps)
      // e só sobe se o aparelho de fato demonstrar quadros mais lentos.
      let avgFrameDt = 16.7;

      // Cada seek força o navegador a decodificar aquele ponto do vídeo, o
      // que custa CPU. Só limitar a taxa é necessário quando o aparelho
      // realmente não aguenta — a grande maioria roda liso a ~30 seeks/s, e
      // um limite fixo conservador pra todo mundo deixa o vídeo com cara de
      // "picotado" à toa nesses aparelhos. Em vez de um teto fixo, o
      // intervalo mínimo entre seeks é calculado a partir do tempo real
      // entre quadros do rAF (suavizado por média móvel): se os quadros
      // estão vindo no ritmo esperado, busca perto do teto rápido (~30fps);
      // se estão demorando mais que isso (sinal real de que o aparelho está
      // engasgando — inclusive por causa do próprio custo do seek anterior),
      // o intervalo cresce sozinho, na mesma proporção, até um teto mais
      // conservador pros casos realmente fracos.
      const SEEK_DELTA = 0.02;
      const FAST_SEEK_INTERVAL_MS = 33; // ~30 seeks/s em aparelhos saudáveis
      const SLOW_SEEK_INTERVAL_MS = 100; // teto pra aparelhos realmente fracos

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

      // Lê a posição da seção (getBoundingClientRect força um reflow
      // síncrono) só dentro do próprio loop de rAF, nunca direto num
      // handler de `scroll` — um handler de scroll dispara a taxa nativa
      // de eventos do navegador (pode passar de 60/s no toque), enquanto o
      // rAF já é naturalmente alinhado com a taxa de repaint da tela. Isso
      // evita empilhar leituras de layout fora de sincronia com a pintura,
      // que é outra fonte comum de engasgo em aparelhos mais fracos (além
      // do custo do seek do vídeo em si).
      function tick(now: number) {
        if (lastTickAt) {
          const frameDt = now - lastTickAt;
          avgFrameDt = avgFrameDt * 0.85 + frameDt * 0.15;
        }
        lastTickAt = now;

        targetProgress = computeProgress();
        setHeaderVisible(targetProgress > 0.92);
        updateHint(targetProgress);

        if (video && video.duration) {
          const targetTime = targetProgress * video.duration;
          const delta = Math.abs(video.currentTime - targetTime);
          // Intervalo mínimo entre seeks, adaptado ao ritmo real dos
          // últimos quadros (2x a média — dá margem pro custo do próprio
          // seek sem exigir dois seeks caros consecutivos).
          const seekInterval = Math.min(
            SLOW_SEEK_INTERVAL_MS,
            Math.max(FAST_SEEK_INTERVAL_MS, avgFrameDt * 2),
          );
          const dueForSeek = now - lastSeekAt >= seekInterval;
          // Sempre aplica o frame final (progress 0 ou 1) mesmo fora do
          // intervalo mínimo, pra não deixar o vídeo "preso" um pouco atrás
          // do ponto onde o usuário parou de rolar.
          const isEdge = targetProgress === 0 || targetProgress === 1;
          if (delta > SEEK_DELTA && (dueForSeek || isEdge)) {
            video.currentTime = targetTime;
            lastSeekAt = now;
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
        // resolve isso sem o usuário perceber. Um seek "de aquecimento" logo
        // em seguida (fora do loop de scroll) absorve o custo de decodificar
        // o primeiro ponto arbitrário do vídeo — em aparelhos mais fracos
        // esse primeiro seek é mais caro que os seguintes (o decoder ainda
        // não tinha feito esse tipo de busca), e é melhor pagar esse custo
        // aqui, antes do usuário começar a rolar, do que no meio do scroll.
        video
          .play()
          .then(() => {
            video.pause();
            video.currentTime = Math.min(0.05, video.duration || 0.05);
          })
          .catch(() => video.pause());
        rafId = requestAnimationFrame(tick);
      }

      if (video.readyState >= 1) setup();
      else video.addEventListener("loadedmetadata", setup, { once: true });

      return () => {
        video.removeEventListener("loadedmetadata", setup);
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
          updateHint(self.progress);
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

        {/* Dica de scroll — visível só no primeiro instante (ver HINT_HIDE_AT),
            escrita/escondida via ref (não estado do React) pelos loops de
            tick acima. Puramente decorativa: não captura clique/toque. */}
        <div
          ref={hintRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center opacity-100 transition-opacity duration-500 ease-out sm:bottom-12"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.5 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">
              Role para explorar
            </span>
            <ChevronDown className="h-5 w-5" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
