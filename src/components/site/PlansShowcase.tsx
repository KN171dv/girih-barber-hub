import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";
import { usePlans, useSiteSettings, type Plan } from "@/lib/site-content";
import { formatPrice } from "@/lib/format";
import { planMessage, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Destaque público dos planos ativos (Clube Gireh). Nada é exibido se não houver planos. */
export function PlansShowcase() {
  const { data: plans = [] } = usePlans();
  const { data: settings } = useSiteSettings();
  const whatsapp = settings?.contact.whatsapp;

  const featured: Plan[] = plans.slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section id="planos" className="scroll-mt-24 border-y border-border/60 bg-surface/20 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionLabel
          eyebrow="Planos"
          title="CLUBE GIREH"
          description="Para quem faz do cuidado uma rotina."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((plan, index) => {
            const price = formatPrice(plan.price_cents, plan.price_label);
            const href = whatsappLink(whatsapp, planMessage(plan.name));
            const items = [...plan.included_services, ...plan.benefits].slice(0, 5);
            return (
              <Reveal key={plan.id} delay={index * 80}>
                <article
                  className={cn(
                    "surface-card flex h-full flex-col gap-5 p-7",
                    plan.highlight && "border-primary/50",
                  )}
                >
                  <div>
                    <h3 className="text-3xl uppercase tracking-[0.06em]">{plan.name}</h3>
                    {plan.summary && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {plan.summary}
                      </p>
                    )}
                  </div>
                  {price && (
                    <p className="flex items-end gap-2">
                      <span className="font-display text-4xl leading-none text-primary">
                        {price}
                      </span>
                      {plan.billing_period && (
                        <span className="pb-1 text-sm text-muted-foreground">
                          /{plan.billing_period}
                        </span>
                      )}
                    </p>
                  )}
                  {items.length > 0 && (
                    <ul className="flex-1 space-y-2 text-sm text-muted-foreground">
                      {items.map((item, i) => (
                        <li key={`${item}-${i}`} className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    asChild
                    variant={plan.highlight ? "gold" : "outlineGold"}
                    className="mt-auto h-12 w-full tracking-[0.16em]"
                  >
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer">
                        CONHECER O PLANO <ArrowRight aria-hidden="true" />
                      </a>
                    ) : (
                      <a href="/planos">
                        CONHECER O PLANO <ArrowRight aria-hidden="true" />
                      </a>
                    )}
                  </Button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
