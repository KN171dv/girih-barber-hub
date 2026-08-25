import { MapPin, Clock, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";

/** Faixa de informações rápidas logo abaixo do hero. Dados vindos do painel. */
export function QuickInfoBar() {
  const { data: settings } = useSiteSettings();
  const location = settings?.location;
  const hours = settings?.hours.items ?? [];
  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());

  return (
    <section className="border-y border-border/60 bg-surface/25">
      <div className="mx-auto grid max-w-6xl divide-y divide-border/60 px-4 md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="flex min-w-0 gap-4 py-7 md:pr-8">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="eyebrow">Onde estamos</p>
            {location?.address ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {location.address}
                <br />
                <span className="text-foreground">
                  {location.city}
                  {location.state ? ` — ${location.state}` : ""}
                </span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Rio das Ostras — RJ</p>
            )}
          </div>
        </div>

        <div className="flex min-w-0 gap-4 py-7 md:px-8">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="eyebrow">Horários</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {hours.map((item, index) => (
                <li key={`${item.day}-${index}`}>
                  {item.day}: <span className="text-foreground">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex min-w-0 gap-4 py-7 md:pl-8">
          <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="eyebrow">Agendamento</p>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-foreground underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline"
              >
                WhatsApp
              </a>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">WhatsApp</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
