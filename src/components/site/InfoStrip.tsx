import { MapPin, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableHint } from "./EditableHint";
import { useSiteSettings } from "@/lib/site-content";

/** Faixa com localização, horário e botão de rota. */
export function InfoStrip() {
  const { data: settings } = useSiteSettings();
  const location = settings?.location;
  const hours = settings?.hours.items ?? [];

  const fullAddress = location?.address
    ? `${location.address} — ${location.city}/${location.state}`
    : null;

  return (
    <section className="border-y border-primary/20 bg-gradient-to-r from-surface/60 via-background to-surface/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-3 md:items-center">
        <div className="flex gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="eyebrow">Onde estamos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {fullAddress ?? <EditableHint>Endereço a cadastrar</EditableHint>}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="eyebrow">Horários</p>
            <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
              {hours.length === 0 && <li><EditableHint>Horários a cadastrar</EditableHint></li>}
              {hours.map((item, index) => (
                <li key={`${item.day}-${index}`}>
                  {item.day}: <span className="text-foreground">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:justify-self-end">
          <Button asChild variant="gold" size="lg" disabled={!location?.directions_url}>
            <a href={location?.directions_url || "#"} target="_blank" rel="noreferrer">
              <Navigation aria-hidden="true" /> Como chegar
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
