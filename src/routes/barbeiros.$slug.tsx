import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { EditableHint } from "@/components/site/EditableHint";
import { useBarbers, useMedia, useServices, useSiteSettings } from "@/lib/site-content";
import { barberBookingMessage, whatsappLink } from "@/lib/whatsapp";
import placeholder from "@/assets/placeholder-barber.jpg";
import { barbers as staticBarbers } from "@/data/barbers";

export const Route = createFileRoute("/barbeiros/$slug")({
  head: ({ params }) => {
    const barber = staticBarbers.find((item) => item.slug === params.slug);
    const title = barber
      ? `${barber.name} — Barbeiro na Gireh Barber Shop | Rio das Ostras`
      : "Perfil do barbeiro — Gireh Barber Shop";
    const description = barber
      ? `Conheça ${barber.name}, barbeiro da Gireh Barber Shop em Rio das Ostras (RJ). ${barber.bio || "Agende seu horário pelo WhatsApp."}`
      : "Perfil do barbeiro da Gireh Barber Shop em Rio das Ostras: especialidades, apresentação, portfólio e agendamento pelo WhatsApp.";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(barber?.photo_url ? [{ property: "og:image", content: barber.photo_url }] : []),
      ],
    };
  },
  component: BarberProfile,
});

function BarberProfile() {
  const { slug } = Route.useParams();
  const { data: barbers = [], isLoading } = useBarbers();
  const { data: services = [] } = useServices();
  const { data: settings } = useSiteSettings();
  const { data: media = [] } = useMedia();
  const [service, setService] = useState("");

  const barber = barbers.find((item) => item.slug === slug);
  const portfolio = media.filter((item) => item.barber_id === barber?.id);

  if (!barber) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-4xl">
            {isLoading ? "Carregando perfil..." : "Barbeiro não encontrado"}
          </h1>
          <Button asChild variant="outlineGold" className="mt-6">
            <Link to="/barbeiros">
              <ArrowLeft aria-hidden="true" /> Ver todos os barbeiros
            </Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const wa = whatsappLink(
    barber.whatsapp || settings?.contact.whatsapp,
    barberBookingMessage(barber.name, service),
  );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Link
          to="/barbeiros"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Nossos barbeiros
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="surface-card overflow-hidden">
            <img
              src={barber.photo_url || placeholder}
              alt={barber.name}
              width={900}
              height={1200}
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div>
            <p className="eyebrow">{barber.role_title || "Barbeiro"}</p>
            <h1 className="mt-3 text-5xl sm:text-6xl">{barber.name}</h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {barber.bio || (
                <EditableHint>Apresentação a cadastrar em src/data/barbers.ts</EditableHint>
              )}
            </p>

            {barber.specialties.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {barber.specialties.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 surface-card space-y-4 p-6">
              <label className="block text-sm text-muted-foreground" htmlFor="servico">
                Escolha o serviço para a mensagem de agendamento
              </label>
              <select
                id="servico"
                value={service}
                onChange={(event) => setService(event.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Um serviço</option>
                {services.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              {wa ? (
                <Button asChild variant="whatsapp" size="lg" className="w-full">
                  <a href={wa} target="_blank" rel="noreferrer">
                    <MessageCircle aria-hidden="true" /> Agendar com este barbeiro
                  </a>
                </Button>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Agendamento indisponível no momento.
                </p>
              )}

              {barber.instagram && (
                <Button asChild variant="ghost" className="w-full">
                  <a href={barber.instagram} target="_blank" rel="noreferrer">
                    <Instagram aria-hidden="true" /> Instagram do profissional
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <p className="eyebrow">Portfólio</p>
          <h2 className="mt-2 text-3xl">Trabalhos de {barber.name}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.length === 0 && (
              <div className="surface-card flex h-56 items-center justify-center p-6 text-center">
                <p className="text-sm text-muted-foreground">Portfólio em preparação.</p>
              </div>
            )}
            {portfolio.map((item) =>
              item.media_type === "video" ? (
                <video
                  key={item.id}
                  src={item.url}
                  poster={item.thumbnail_url || undefined}
                  controls
                  preload="none"
                  className="h-56 w-full rounded-xl border border-border object-cover"
                />
              ) : (
                <img
                  key={item.id}
                  src={item.url}
                  alt={item.title || `Trabalho de ${barber.name}`}
                  loading="lazy"
                  className="h-56 w-full rounded-xl border border-border object-cover"
                />
              ),
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
