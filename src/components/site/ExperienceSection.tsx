import { Snowflake, Music, Sofa, Coffee, Sparkles, Scissors, Star } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";
import { EditableHint } from "./EditableHint";
import { useSiteSettings } from "@/lib/site-content";

const ICONS: Record<string, typeof Sparkles> = {
  snowflake: Snowflake,
  music: Music,
  sofa: Sofa,
  coffee: Coffee,
  scissors: Scissors,
  star: Star,
  sparkles: Sparkles,
};

/**
 * "A experiência Gireh" — apresentação premium dos diferenciais.
 * Os dados vêm de src/data/site-settings.ts (campo experience).
 */
export function ExperienceSection() {
  const { data: settings } = useSiteSettings();
  const experience = settings?.experience;
  const items = (experience?.items ?? []).filter((item) => (item.title || item.text || '').trim());

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-surface/20 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionLabel
          eyebrow="A Experiência"
          title={experience?.title || "A EXPERIÊNCIA GIREH"}
          description={
            experience?.subtitle ||
            "Não é apenas sobre cortar o cabelo. É sobre como você chega e como você sai."
          }
        />

        {items.length === 0 ? (
          <div className="mt-10">
            <EditableHint>Diferenciais a cadastrar em src/data/site-settings.ts</EditableHint>
          </div>
        ) : (
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
              const Icon = ICONS[item.icon] ?? Sparkles;
              return (
                <Reveal key={`${item.title}-${index}`} delay={index * 80} className="h-full">
                  <article className="group relative h-full overflow-hidden bg-background p-8 transition-colors duration-300 hover:bg-surface/50">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[6rem] leading-none text-foreground/[0.04] transition-colors duration-300 group-hover:text-primary/10"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      className="h-6 w-6 text-primary transition-transform duration-300 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                    <h3 className="mt-6 text-2xl uppercase tracking-[0.08em]">{item.title}</h3>
                    <span
                      aria-hidden="true"
                      className="mt-4 block h-px w-10 bg-primary/50 transition-all duration-300 group-hover:w-16"
                    />
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
