import { MapPin, Navigation, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableHint } from "./EditableHint";
import { useSiteSettings } from "@/lib/site-content";

export function MapSection({ showHours = true }: { showHours?: boolean }) {
  const { data: settings } = useSiteSettings();
  const location = settings?.location;
  const hours = settings?.hours.items ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="surface-card space-y-5 p-7">
        <div className="flex gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="eyebrow">Endereço</p>
            <p className="mt-1 text-base text-foreground">
              {location?.address || <EditableHint>Endereço a cadastrar</EditableHint>}
            </p>
            <p className="text-sm text-muted-foreground">
              {location?.city}/{location?.state}
            </p>
          </div>
        </div>

        {showHours && (
          <div className="flex gap-3">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="w-full">
              <p className="eyebrow">Horários</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {hours.length === 0 && <li><EditableHint>Horários a cadastrar</EditableHint></li>}
                {hours.map((item, index) => (
                  <li key={`${item.day}-${index}`} className="flex justify-between gap-6">
                    <span>{item.day}</span>
                    <span className="text-foreground">{item.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Button asChild variant="gold" size="lg" disabled={!location?.directions_url}>
          <a href={location?.directions_url || "#"} target="_blank" rel="noreferrer">
            <Navigation aria-hidden="true" /> Como chegar
          </a>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        {location?.map_embed_url ? (
          <iframe
            src={location.map_embed_url}
            title="Mapa da Girih Barbearia"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[380px] w-full"
          />
        ) : (
          <div className="flex h-[380px] items-center justify-center bg-surface/60">
            <EditableHint>Mapa a cadastrar no painel</EditableHint>
          </div>
        )}
      </div>
    </div>
  );
}
