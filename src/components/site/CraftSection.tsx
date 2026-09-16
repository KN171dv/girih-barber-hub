import { useRef } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "./SectionLabel";
import { useParallax } from "@/lib/use-parallax";
import { EASE_SMOOTH } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type CraftItem = {
  title: string;
  text: string;
  image: string;
  /** Texto alternativo descritivo da foto (não repete o título). */
  imageAlt: string;
};

function CraftBlock({ item, index }: { item: CraftItem; index: number }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const reverse = index % 2 === 1;
  useParallax(imgRef, 28);

  return (
    <div
      className={cn(
        "grid items-center gap-8 lg:grid-cols-2 lg:gap-16",
        index > 0 && "mt-14 sm:mt-20 lg:mt-28",
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: reverse ? 32 : -32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: EASE_SMOOTH }}
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70",
          reverse && "lg:order-2",
        )}
      >
        <img
          ref={imgRef}
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          className="absolute inset-0 h-[130%] w-full -translate-y-[15%] scale-110 object-cover"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reverse ? -32 : 32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: EASE_SMOOTH, delay: 0.1 }}
        className={cn(reverse && "lg:order-1")}
      >
        <span className="font-mono text-xs tracking-[0.3em] text-primary/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-3 text-2xl uppercase tracking-[0.04em] sm:text-3xl">{item.title}</h3>
        <span className="mt-4 block h-px w-12 bg-primary/50" aria-hidden="true" />
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {item.text}
        </p>
      </motion.div>
    </div>
  );
}

/**
 * "O Ofício": conta a história da técnica por trás de cada instrumento —
 * tesoura, navalha e máquina — em blocos alternados de imagem e texto.
 */
export function CraftSection({ index, items }: { index?: string; items: CraftItem[] }) {
  return (
    <section id="oficio" className="scroll-mt-24 section-y">
      <div className="mx-auto max-w-6xl px-4">
        <SectionLabel
          {...(index ? { index } : {})}
          eyebrow="O Ofício"
          title="TÉCNICA QUE SE APRENDE COM O TEMPO"
          description="Cada instrumento tem sua função, seu momento e seu cuidado. É essa atenção ao detalhe que separa um corte qualquer de um corte bem feito."
        />

        <div className="mt-12 sm:mt-16 lg:mt-20">
          {items.map((item, i) => (
            <CraftBlock key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
