import { Star } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { EASE_SMOOTH } from "@/lib/motion";
import { STATS_CONFIG } from "@/data/stats";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_SMOOTH } },
};

/**
 * Números animados: contam de 0 até o valor final quando a seção entra
 * na tela. Os valores em si vêm de src/data/stats.ts — edite lá (não aqui)
 * quando tiver os números reais de clientes atendidos e avaliação média.
 */
export function StatsSection({ index }: { index?: string }) {
  const years = Math.max(1, new Date().getFullYear() - STATS_CONFIG.foundingYear);

  const stats = [
    { value: years, suffix: "+", label: "Anos de tradição" },
    { value: STATS_CONFIG.clientsServed, suffix: "+", label: "Clientes atendidos" },
    {
      value: STATS_CONFIG.averageRating,
      suffix: " / 5",
      decimals: 1,
      label: "Avaliação média",
      icon: Star,
    },
  ];

  return (
    <section className="border-y border-border/60 bg-surface/20 section-y">
      <div className="mx-auto max-w-6xl px-4">
        {index && (
          <div className="mb-8 flex items-center justify-center gap-3 sm:mb-12 sm:justify-start">
            <span className="font-mono text-xs tracking-[0.3em] text-primary/70">{index}</span>
            <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
            <span className="eyebrow">Números</span>
          </div>
        )}

        <motion.dl
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="flex flex-col items-center gap-2 py-8 text-center first:pt-0 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:pr-0"
            >
              {stat.icon && <stat.icon className="mb-1 h-5 w-5 text-primary" aria-hidden="true" />}
              <dt className="order-2 mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-5xl leading-none text-gradient-gold sm:text-6xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
