import { Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableHint } from "./EditableHint";
import { formatDuration, formatPrice } from "@/lib/format";
import { serviceBookingMessage, whatsappLink } from "@/lib/whatsapp";
import type { Service } from "@/lib/site-content";
import placeholder from "@/assets/placeholder-media.jpg";

export function ServiceCard({
  service,
  fallbackWhatsapp,
}: {
  service: Service;
  fallbackWhatsapp?: string;
}) {
  const price = formatPrice(service.price_cents, service.price_label);
  const duration = formatDuration(service.duration_minutes);
  const href = whatsappLink(
    service.whatsapp_override || fallbackWhatsapp,
    serviceBookingMessage(service.name),
  );

  return (
    <article className="surface-card flex flex-col overflow-hidden">
      <img
        src={service.image_url || placeholder}
        alt={service.name || "Serviço da Girih Barbearia"}
        loading="lazy"
        width={1200}
        height={900}
        className="h-48 w-full object-cover opacity-90"
      />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-2xl">
          {service.name || <EditableHint>Nome do serviço a cadastrar</EditableHint>}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {service.description || <EditableHint>Descrição a cadastrar no painel</EditableHint>}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            {duration ?? "Duração a definir"}
          </span>
          <span className="font-display text-2xl text-primary">
            {price ?? "Valor a definir"}
          </span>
        </div>
        {href ? (
          <Button asChild variant="whatsapp" className="mt-2 w-full">
            <a href={href} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" /> Agendar pelo WhatsApp
            </a>
          </Button>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            <EditableHint>Cadastre o WhatsApp no painel para ativar o agendamento</EditableHint>
          </p>
        )}
      </div>
    </article>
  );
}
