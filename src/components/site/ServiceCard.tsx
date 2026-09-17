import { Clock, Scissors, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableHint } from "./EditableHint";
import { cn } from "@/lib/utils";
import { formatDuration, formatPrice } from "@/lib/format";
import { serviceBookingMessage, whatsappLink } from "@/lib/whatsapp";
import type { Service } from "@/lib/site-content";

export function ServiceCard({
  service,
  fallbackWhatsapp,
}: {
  service: Service;
  fallbackWhatsapp?: string | undefined;
}) {
  const price = formatPrice(service.price_cents, service.price_label);
  const duration = formatDuration(service.duration_minutes);
  const href = whatsappLink(
    service.whatsapp_override || fallbackWhatsapp,
    serviceBookingMessage(service.name),
  );
  const highlighted = Boolean(service.highlight);
  const badge = (service.highlight_label || "").trim();

  return (
    <article
      className={cn(
        "surface-card group relative flex h-full flex-col overflow-hidden transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/40",
        highlighted && "border-primary/45 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]",
      )}
    >
      {highlighted && badge && (
        <span className="absolute right-4 top-4 z-10 rounded-full border border-primary/40 bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary backdrop-blur">
          {badge}
        </span>
      )}

      {service.image_url ? (
        <div className="overflow-hidden">
          <img
            src={service.image_url}
            alt={
              service.name
                ? `${service.name} — ${service.description || "serviço da Gireh Barber Shop"}`
                : "Serviço da Gireh Barber Shop"
            }
            loading="lazy"
            width={1200}
            height={900}
            className="h-44 w-full object-cover opacity-90 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-100"
          />
        </div>
      ) : (
        <div className="flex h-44 items-center justify-center border-b border-border/60 bg-surface/40">
          <Scissors className="h-10 w-10 text-primary/40" aria-hidden="true" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-2xl uppercase tracking-wide">
          {service.name || <EditableHint>Nome do serviço a cadastrar</EditableHint>}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {service.description || (
            <EditableHint>Descrição a definir em src/data/services.ts</EditableHint>
          )}
        </p>

        <div className="mt-2 flex items-end justify-between gap-4 border-t border-border/60 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/80" aria-hidden="true" />
            {duration ?? "A definir"}
          </span>
          <span className="font-display text-3xl leading-none text-primary sm:text-[2rem]">
            {price ?? "A definir"}
          </span>
        </div>

        {href ? (
          <Button
            asChild
            variant={highlighted ? "gold" : "outlineGold"}
            className="mt-4 h-12 w-full text-xs tracking-[0.16em]"
          >
            <a href={href} target="_blank" rel="noreferrer">
              <Sparkles aria-hidden="true" /> AGENDAR ESTE SERVIÇO
            </a>
          </Button>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">
            <EditableHint>
              Cadastre o WhatsApp em src/data/site-settings.ts para ativar o agendamento
            </EditableHint>
          </p>
        )}
      </div>
    </article>
  );
}
