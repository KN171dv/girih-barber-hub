import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePlans, useSiteSettings, type Plan } from "@/lib/site-content";
import { formatPrice } from "@/lib/format";
import { planMessage, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Planos & assinaturas em carrossel horizontal premium.
 * Somente dados já cadastrados no painel são exibidos.
 */
export function PlansCarousel({ index }: { index?: string }) {
  const { data: plans = [] } = usePlans();
  const { data: settings } = useSiteSettings();
  const whatsapp = settings?.contact.whatsapp;

  if (plans.length === 0) return null;

  return (
    <section
      id="planos"
      className="scroll-mt-24 border-y border-border/60 bg-surface/20 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionLabel
          index={index}
          eyebrow="Planos & Assinaturas"
          title="ESCOLHA SEU PLANO GIREH"
          description="Mais praticidade para quem mantém o estilo sempre em dia. Escolha o plano que combina com a sua rotina."
        />

        <Reveal className="mt-12">
          <Carousel opts={{ align: "start", loop: plans.length > 3 }} className="w-full">
            <CarouselContent className="-ml-4">
              {plans.map((plan) => (
                <CarouselItem
                  key={plan.id}
                  className="basis-[86%] pl-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <PlanSlide plan={plan} whatsapp={whatsapp} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-8 flex items-center justify-end gap-3">
              <CarouselPrevious className="static h-11 w-11 translate-y-0 border-border/70 bg-background/60 text-foreground hover:border-primary hover:text-primary" />
              <CarouselNext className="static h-11 w-11 translate-y-0 border-border/70 bg-background/60 text-foreground hover:border-primary hover:text-primary" />
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}

function PlanSlide({ plan, whatsapp }: { plan: Plan; whatsapp?: string }) {
  const price = formatPrice(plan.price_cents, plan.price_label);
  const href = whatsappLink(whatsapp, planMessage(plan.name));
  const items = [...plan.included_services, ...plan.benefits];

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-6 rounded-2xl border border-border/70 bg-background/70 p-8 transition-colors duration-300 hover:border-primary/50",
        plan.highlight && "border-primary/50",
      )}
    >
      <div>
        <h3 className="text-3xl uppercase tracking-[0.06em]">{plan.name}</h3>
        {plan.summary && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>
        )}
      </div>

      {price && (
        <p className="flex items-end gap-2">
          <span className="font-display text-4xl leading-none text-primary">{price}</span>
          {plan.billing_period && (
            <span className="pb-1 text-sm text-muted-foreground">/{plan.billing_period}</span>
          )}
        </p>
      )}

      {items.length > 0 && (
        <ul className="flex-1 space-y-2.5 text-sm text-muted-foreground">
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
            ESCOLHER ESTE PLANO <ArrowRight aria-hidden="true" />
          </a>
        ) : (
          <a href="/planos">
            ESCOLHER ESTE PLANO <ArrowRight aria-hidden="true" />
          </a>
        )}
      </Button>
    </article>
  );
}
