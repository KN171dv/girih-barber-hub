import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fundo cinematográfico do hero: vídeo do YouTube em loop silencioso,
 * enquadrado em "cover" (sem faixas pretas e sem cara de player), com
 * imagem real da barbearia como fallback imediato.
 *
 * O vídeo só é montado no desktop, com conexão razoável e quando o usuário
 * não pediu redução de movimento — nos demais casos fica só a foto.
 */
export function HeroVideoBackdrop({
  videoId,
  fallbackImage,
  fallbackAlt,
}: {
  videoId: string;
  fallbackImage: string;
  fallbackAlt: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = window.matchMedia("(max-width: 767px)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    const slow = Boolean(conn?.saveData) || /2g/.test(conn?.effectiveType ?? "");
    if (reduced || smallScreen || slow) return;
    // Pequeno atraso: prioriza o conteúdo/foto na primeira pintura.
    const id = window.setTimeout(() => setEnabled(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  const src =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}` +
    `&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&fs=0`;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-background" aria-hidden="true">
      <img
        src={fallbackImage}
        alt={fallbackAlt}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {enabled && (
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000",
            "h-[max(115%,64vw)] w-[max(115%,204vh)]",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <iframe
            src={src}
            title="Ambiente da Gireh Barber Shop"
            allow="autoplay; encrypted-media"
            loading="lazy"
            tabIndex={-1}
            onLoad={() => setReady(true)}
            className="h-full w-full border-0"
          />
        </div>
      )}

      {/* Overlay cinematográfico */}
      <div className="absolute inset-0 bg-background/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/90 to-transparent" />
    </div>
  );
}
