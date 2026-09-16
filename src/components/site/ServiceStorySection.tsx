import { useRef } from "react";
import { motion } from "framer-motion";
import { Clock, MessageCircle, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "./SectionLabel";
import { EditableHint } from "./EditableHint";
import { useParallax } from "@/lib/use-parallax";
import { EASE_SMOOTH } from "@/lib/motion";
import { formatDuration, formatPrice } from "@/lib/format";
import { serviceBookingMessage, whatsappLink } from "@/lib/whatsapp";
import type { Service } from "@/lib/site-content";
import { cn } from "@/lib/utils";

function ServiceStoryRow({
  service,
  index,
  fallbackImage,
  fallbackWhatsapp,
}: {
  service: Service;
  index: number;
  fallbackImage: string;
  fallbackWhatsapp?: string | undefined;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const reverse = index % 2 === 1;
  useParallax(imgRef, 26);

  const price = formatPrice(service.price_cents, service.price_label);
  const duration = formatDuration(service.duration_minutes);
  const href = whatsappLink(
    service.whatsapp_override || fallbackWhatsapp,
    serviceBookingMessage(service.name),
  );

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
          src={service.image_url || fallbackImage}
          alt={
            service.name
              ? `${service.name} — ${service.description || "serviço da Gireh Barber Shop"}`
              : "Serviço da Gireh Barber Shop"
          }
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
        <h3 className="text-2xl uppercase tracking-[0.04em] sm:text-3xl">{service.name}</h3>
        <span className="mt-4 block h-px w-12 bg-primary/50" aria-hidden="true" />
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {service.description || (
            <EditableHint>Descrição a definir em src/data/services.ts</EditableHint>
          )}
        </p>

        <div className="mt-6 flex items-center gap-5">
          {duration && (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary/80" aria-hidden="true" /> {duration}
            </span>
          )}
          {price && <span className="font-display text-3xl text-primary">{price}</span>}
        </div>

        {href && (
          <Button
            asChild
            variant="gold"
            size="lg"
            className="mt-7 w-full tracking-[0.16em] sm:w-auto"
          >
            <a href={href} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" /> AGENDAR{" "}
              {service.name?.toUpperCase() || "ESTE SERVIÇO"}
            </a>
          </Button>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Showcase individual dos serviços em destaque — cada serviço com sua
 * própria seção animada (imagem grande + descrição), no espírito de uma
 * vitrine premium. A lista completa de preços continua logo abaixo.
 */
export function ServiceStorySection({
  index,
  services,
  fallbackImage,
  fallbackWhatsapp,
  max = 4,
}: {
  index?: string;
  services: Service[];
  fallbackImage: string;
  fallbackWhatsapp?: string | undefined;
  max?: number;
}) {
  const featured = services.slice(0, max);

  if (featured.length === 0) {
    return (
      <section id="servicos" className="scroll-mt-24 section-y">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            {...(index ? { index } : {})}
            eyebrow="Serviços"
            title="CORTE, BARBA E CUIDADO EM CADA DETALHE"
            description="Escolha seu serviço e agende seu horário."
          />
          <div className="mt-10 flex items-center gap-2 text-muted-foreground">
            <Scissors className="h-4 w-4 text-primary/70" aria-hidden="true" />
            <EditableHint>Serviços a cadastrar em src/data/services.ts</EditableHint>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicos" className="scroll-mt-24 section-y">
      <div className="mx-auto max-w-6xl px-4">
        <SectionLabel
          {...(index ? { index } : {})}
          eyebrow="Serviços em Destaque"
          title="CORTE, BARBA E CUIDADO EM CADA DETALHE"
          description="Escolha seu serviço e agende seu horário."
        />

        <div className="mt-12 sm:mt-16 lg:mt-20">
          {featured.map((service, i) => (
            <ServiceStoryRow
              key={service.id}
              service={service}
              index={i}
              fallbackImage={fallbackImage}
              fallbackWhatsapp={fallbackWhatsapp}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
