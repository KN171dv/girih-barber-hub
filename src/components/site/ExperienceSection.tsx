import { Snowflake, Music, Sofa, Coffee, Sparkles } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { EditableHint } from "./EditableHint";
import { useSiteSettings } from "@/lib/site-content";

const ICONS: Record<string, typeof Sparkles> = {
  snowflake: Snowflake,
  music: Music,
  sofa: Sofa,
  coffee: Coffee,
};

export function ExperienceSection() {
  const { data: settings } = useSiteSettings();
  const experience = settings?.experience;
  const items = experience?.items ?? [];

  return (
    <section className="border-y border-border/60 bg-surface/30 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Ambiente"
          title={experience?.title || "A experiência Girih"}
          description={
            experience?.subtitle || (
              <EditableHint>Texto da experiência editável no painel</EditableHint>
            )
          }
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.length === 0 && (
            <EditableHint>Itens da experiência a cadastrar no painel</EditableHint>
          )}
          {items.map((item, index) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            return (
              <article key={`${item.title}-${index}`} className="surface-card p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
