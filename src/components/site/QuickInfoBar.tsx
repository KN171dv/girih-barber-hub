import { MapPin, Clock, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage, onlyDigits } from "@/lib/whatsapp";

function formatPhone(value: string) {
  const digits = onlyDigits(value).replace(/^55/, "");
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value;
}

/** Faixa compacta: localização, horários e WhatsApp. Dados vindos de src/data/site-settings.ts. */
export function QuickInfoBar() {
  const { data: settings } = useSiteSettings();
  const location = settings?.location;
  const hours = settings?.hours.items ?? [];
  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());
  const phone = settings?.contact.whatsapp;

  return (
    <section className="border-y border-border/60 bg-surface/25">
      <div className="mx-auto grid max-w-6xl gap-5 divide-y divide-border/60 px-4 py-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-y-0">
        <div className="flex min-w-0 items-start gap-3 md:pr-8">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              Onde estamos
            </p>
            <p className="mt-1.5 text-sm text-foreground">
              {location?.city
                ? `${location.city}${location.state ? ` — ${location.state}` : ""}`
                : "Rio das Ostras — RJ"}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-start gap-3 pt-5 md:px-8 md:pt-0">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              Horários
            </p>
            <ul className="mt-1.5 space-y-0.5 text-sm text-foreground">
              {hours.map((item, index) => (
                <li key={`${item.day}-${index}`}>
                  <span className="text-muted-foreground">{item.day}:</span> {item.hours}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex min-w-0 items-start gap-3 pt-5 md:pl-8 md:pt-0">
          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              WhatsApp
            </p>
            {wa && phone ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-block text-sm text-foreground underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline"
              >
                {formatPhone(phone)}
              </a>
            ) : (
              <p className="mt-1.5 text-sm text-muted-foreground">A definir no código</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
