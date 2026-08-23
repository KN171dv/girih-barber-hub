import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Navigation, Play, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { EditableHint } from "@/components/site/EditableHint";
import { ServiceCard } from "@/components/site/ServiceCard";
import { BarberCard } from "@/components/site/BarberCard";
import { PlanCard } from "@/components/site/PlanCard";
import { useBarbers, useMedia, usePlans, useServices, useSiteSettings } from "@/lib/site-content";
import { generalMessage, whatsappLink } from "@/lib/whatsapp";
import heroImage from "@/assets/placeholder-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Girih Barbearia — Barbearia premium em Rio das Ostras, RJ" },
      {
        name: "description",
        content:
          "Girih Barbearia em Rio das Ostras (RJ): cortes, barba e cuidados masculinos com atendimento de alto padrão. Agende pelo WhatsApp.",
      },
      { property: "og:title", content: "Girih Barbearia — Rio das Ostras, RJ" },
      {
        property: "og:description",
        content: "Experiência premium em corte, barba e cuidados masculinos em Rio das Ostras.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: settings } = useSiteSettings();
  const { data: services = [] } = useServices();
  const { data: barbers = [] } = useBarbers();
  const { data: plans = [] } = usePlans();
  const { data: gallery = [] } = useMedia("galeria");

  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());
  const location = settings?.location;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {settings?.brand.hero_media_url ? (
          <img
            src={settings.brand.hero_media_url}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
        ) : (
          <img
            src={heroImage}
            alt=""
            width={1600}
            height={1008}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:py-36">
          <p className="eyebrow fade-up">Rio das Ostras · RJ</p>
          <h1 className="fade-up max-w-3xl text-5xl leading-[0.95] sm:text-7xl">
            {settings?.brand.hero_title || (
              <>
                <span className="text-gradient-gold">Girih Barbearia</span>
                <br /> tradição, precisão e cuidado masculino
              </>
            )}
          </h1>
          <p className="fade-up max-w-xl text-lg text-muted-foreground">
            {settings?.brand.hero_subtitle || (
              <EditableHint>Texto de destaque editável no painel administrativo</EditableHint>
            )}
          </p>
          <div className="fade-up flex flex-wrap gap-3">
            <Button asChild variant="gold" size="xl" disabled={!wa}>
              <a href={wa ?? "#"} target="_blank" rel="noreferrer">
                Agendar agora
              </a>
            </Button>
            <Button asChild variant="outlineGold" size="xl">
              <Link to="/barbeiros">Conheça os barbeiros</Link>
            </Button>
            <Button asChild variant="ghost" size="xl">
              <Link to="/planos">Ver planos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="A barbearia"
            title={settings?.brand.about_title || "Um espaço feito para o seu tempo"}
            description={
              settings?.brand.about_text || (
                <EditableHint>
                  Apresentação da barbearia a ser preenchida no painel administrativo.
                </EditableHint>
              )
            }
          />
          <div className="surface-card overflow-hidden">
            <img
              src={heroImage}
              alt="Ambiente da Girih Barbearia"
              loading="lazy"
              width={1600}
              height={1008}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="border-y border-border/60 bg-surface/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Serviços"
            title="Cortes, barba e cuidados"
            description="Cada serviço com foto, descrição, duração e valor — tudo editável no painel."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                fallbackWhatsapp={settings?.contact.whatsapp}
              />
            ))}
            {services.length === 0 && (
              <p className="text-muted-foreground">
                <EditableHint>Nenhum serviço cadastrado ainda.</EditableHint>
              </p>
            )}
          </div>
          <div className="mt-8">
            <Button asChild variant="outlineGold">
              <Link to="/servicos">Ver todos os serviços</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* BARBEIROS */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading eyebrow="Equipe" title="Nossos barbeiros" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((barber) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section className="border-y border-border/60 bg-surface/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Galeria"
            title="Fotos e vídeos"
            description="Espaço reservado para as mídias reais da barbearia."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.length === 0 && (
              <div className="surface-card flex h-56 items-center justify-center p-6 text-center">
                <EditableHint>Envie fotos e vídeos pelo painel administrativo</EditableHint>
              </div>
            )}
            {gallery.map((item) =>
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
                  alt={item.title || "Foto da Girih Barbearia"}
                  loading="lazy"
                  className="h-56 w-full rounded-xl border border-border object-cover"
                />
              ),
            )}
          </div>
        </div>
      </section>

      {/* 360 */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading
          eyebrow="Conheça nosso espaço"
          title="Panorama 360°"
          description="Cole o link público do panorama 360° do Google Maps no painel para exibir aqui."
        />
        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          {location?.panorama_360_url ? (
            <iframe
              src={location.panorama_360_url}
              title="Panorama 360° da Girih Barbearia"
              loading="lazy"
              allowFullScreen
              className="h-[420px] w-full"
            />
          ) : (
            <div className="flex h-[280px] flex-col items-center justify-center gap-3 bg-surface/60 text-center">
              <Compass className="h-8 w-8 text-primary" aria-hidden="true" />
              <EditableHint>Link do panorama 360° a cadastrar no painel</EditableHint>
            </div>
          )}
        </div>
      </section>

      {/* PLANOS */}
      <section className="border-y border-border/60 bg-surface/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Assinaturas" title="Planos mensais" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.slice(0, 3).map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
            {plans.length === 0 && (
              <EditableHint>Planos a cadastrar no painel administrativo</EditableHint>
            )}
          </div>
          <div className="mt-8">
            <Button asChild variant="gold">
              <Link to="/planos">Ver planos e assinar</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading eyebrow="Onde estamos" title="Rio das Ostras, RJ" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="surface-card space-y-4 p-6">
            <p className="flex gap-2 text-muted-foreground">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {location?.address || <EditableHint>Endereço a cadastrar</EditableHint>}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="gold" disabled={!location?.directions_url}>
                <a
                  href={location?.directions_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation aria-hidden="true" /> Traçar rota
                </a>
              </Button>
              <Button asChild variant="outlineGold">
                <Link to="/localizacao">
                  <Play aria-hidden="true" /> Mais detalhes
                </Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            {location?.map_embed_url ? (
              <iframe
                src={location.map_embed_url}
                title="Mapa da Girih Barbearia"
                loading="lazy"
                className="h-[320px] w-full"
              />
            ) : (
              <div className="flex h-[320px] items-center justify-center bg-surface/60">
                <EditableHint>Mapa a cadastrar no painel</EditableHint>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
