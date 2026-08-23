import { useState } from "react";
import { Camera, Images, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarberPortfolioDialog } from "./BarberPortfolioDialog";
import type { Barber, MediaItem } from "@/lib/site-content";
import { barberBookingMessage, whatsappLink } from "@/lib/whatsapp";

export function BarberCard({ barber, works = [] }: { barber: Barber; works?: MediaItem[] }) {
  const [open, setOpen] = useState(false);
  const bookingHref = whatsappLink(barber.whatsapp, barberBookingMessage(barber.name));

  return (
    <article className="surface-card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[3/4] w-full bg-surface/60">
        {barber.photo_url ? (
          <img
            src={barber.photo_url}
            alt={`${barber.name}, barbeiro, durante um atendimento`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-b border-dashed border-primary/25 text-center text-muted-foreground">
            <Camera className="h-7 w-7" aria-hidden="true" />
            <span className="px-6 text-xs">
              Espaço reservado para a foto vertical de {barber.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-2xl">{barber.name}</h3>
          <p className="text-sm uppercase tracking-[0.18em] text-primary">Barbeiro</p>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{barber.bio}</p>

        {barber.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {barber.specialties.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto grid gap-2">
          <Button variant="outlineGold" onClick={() => setOpen(true)}>
            <Images aria-hidden="true" /> Ver trabalhos
          </Button>
          {bookingHref ? (
            <Button asChild variant="gold">
              <a href={bookingHref} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" /> Agendar com {barber.name}
              </a>
            </Button>
          ) : (
            <Button
              variant="gold"
              onClick={() => setOpen(true)}
              title="Cadastre o WhatsApp deste barbeiro no painel administrativo"
            >
              <MessageCircle aria-hidden="true" /> Agendar com {barber.name}
            </Button>
          )}
          {!bookingHref && (
            <p className="text-center text-[11px] text-muted-foreground">
              WhatsApp exclusivo a configurar no painel
            </p>
          )}
        </div>
      </div>

      <BarberPortfolioDialog
        barber={barber}
        works={works}
        open={open}
        onOpenChange={setOpen}
        bookingHref={bookingHref}
      />
    </article>
  );
}
