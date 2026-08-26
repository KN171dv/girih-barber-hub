import { MapPin, Clock, MessageCircle, Navigation, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableHint } from "./EditableHint";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";

/**
 * Bloco de localização: card único com endereço, horários e agendamento
 * (coluna esquerda) + mapa oficial (coluna direita). Sem repetições.
 */
export function LocationBlock() {
  const { data: settings } = useSiteSettings();
  const location = settings?.location;
  const hours = settings?.hours.items ?? [];
  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());
  const panorama = location?.panorama_360_url;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-surface/25 p-5 sm:gap-7 sm:p-8">
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="eyebrow">Endereço</p>
              <p className="mt-2 break-words text-base text-foreground">
                {location?.address || <EditableHint>Endereço a cadastrar</EditableHint>}
              </p>
              {location?.city && (
                <p className="text-sm text-muted-foreground">
                  {location.city}
                  {location.state ? ` — ${location.state}` : ""}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="w-full min-w-0">
              <p className="eyebrow">Horários</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {hours.length === 0 && (
                  <li>
                    <EditableHint>Horários a cadastrar</EditableHint>
                  </li>
                )}
                {hours.map((item, index) => (
                  <li key={`${item.day}-${index}`} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5">
                    <span>{item.day}</span>
                    <span className="text-foreground">{item.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="eyebrow">Agendamento</p>
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  WhatsApp
                </a>
              ) : (
                <EditableHint>WhatsApp a cadastrar</EditableHint>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
            {location?.directions_url && (
              <Button asChild variant="gold" size="lg" className="tracking-[0.16em] sm:flex-1">
                <a href={location.directions_url} target="_blank" rel="noreferrer">
                  <Navigation aria-hidden="true" /> COMO CHEGAR
                </a>
              </Button>
            )}
            {wa && (
              <Button asChild variant="outlineGold" size="lg" className="tracking-[0.16em] sm:flex-1">
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" /> AGENDAR HORÁRIO
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70">
          {location?.map_embed_url ? (
            <iframe
              src={location.map_embed_url}
              title="Mapa da Gireh Barber Shop"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full sm:h-[480px]"
            />
          ) : (
            <div className="flex h-[360px] items-center justify-center bg-surface/60">
              <EditableHint>Mapa a cadastrar no painel</EditableHint>
            </div>
          )}
        </div>
      </div>

      {panorama && (
        <a
          href={panorama}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-surface/25 px-6 py-5 transition-colors hover:border-primary/50"
        >
          <span className="flex items-center gap-3">
            <View className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
              Explore nosso espaço em 360°
            </span>
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-primary opacity-80 transition-opacity group-hover:opacity-100">
            Abrir
          </span>
        </a>
      )}
    </div>
  );
}
