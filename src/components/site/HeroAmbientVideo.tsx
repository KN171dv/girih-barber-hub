import { useEffect, useRef } from "react";

/**
 * Fundo do Hero (Fase 2) — vídeo de ambiente, sem nenhuma relação com o
 * scroll: só toca sozinho, mudo, em loop, com leve blur e overlay escuro
 * por cima pra manter o título/CTA legíveis. O scroll-scrubbing acontece
 * inteiramente antes, na seção de introdução (ver ScrollVideoIntro).
 */
export function HeroAmbientVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      /* autoplay pode ser bloqueado antes de qualquer interação; o poster cobre o vazio */
    });
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-background" aria-hidden="true">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-[3px]"
      />

      {/* Overlay escuro sutil, pra manter o texto do hero legível sobre o vídeo */}
      <div className="absolute inset-0 bg-background/35" />

      {/* Overlay cinematográfico fixo, igual ao restante do site */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/90 to-transparent" />
    </div>
  );
}
