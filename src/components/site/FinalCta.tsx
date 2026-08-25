import { Link } from "@tanstack/react-router";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";

export function FinalCta({ backgroundUrl }: { backgroundUrl: string }) {
  const { data: settings } = useSiteSettings();
  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());

  return (
    <section className="relative isolate overflow-hidden border-y border-border/60">
      <img
        src={backgroundUrl}
        alt="Ambiente da Gireh Barber Shop"
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-background/85" aria-hidden="true" />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:py-28">
        <p className="eyebrow">Seu próximo corte começa aqui.</p>
        <h2 className="mt-4 text-4xl uppercase leading-[1.02] sm:text-6xl">
          Pronto para renovar o visual?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Escolha seu barbeiro, agende seu horário e deixe o resto com a Gireh.
        </p>
        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          {wa && (
            <Button asChild variant="gold" size="xl" className="tracking-[0.16em]">
              <a href={wa} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" /> AGENDAR AGORA
              </a>
            </Button>
          )}
          <Button asChild variant="outlineGold" size="xl" className="tracking-[0.16em]">
            <Link to="/" hash="barbeiros">
              CONHECER OS BARBEIROS <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
