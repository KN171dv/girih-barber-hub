import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { Reveal } from "./Reveal";
import type { MediaItem } from "@/lib/site-content";

/**
 * Galeria antes/depois: monta pares consecutivos (por `sort_order`) a partir
 * dos itens de coleção `antes_depois` em src/data/media.ts. Sem pares
 * cadastrados, o bloco não é exibido.
 */
export function BeforeAfterGallery({ items }: { items: MediaItem[] }) {
  const pairs: [MediaItem, MediaItem][] = [];
  for (let i = 0; i + 1 < items.length; i += 2) {
    const before = items[i];
    const after = items[i + 1];
    if (before && after) pairs.push([before, after]);
  }

  if (pairs.length === 0) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
      {pairs.map(([before, after], i) => (
        <Reveal key={before.id} delay={i * 80}>
          <BeforeAfterSlider
            before={before.url}
            after={after.url}
            alt={before.title || after.title || "Transformação Gireh Barber Shop"}
          />
        </Reveal>
      ))}
    </div>
  );
}
