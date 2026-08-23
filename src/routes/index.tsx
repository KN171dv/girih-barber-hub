import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Navigation, MapPin, Clock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { EditableHint } from "@/components/site/EditableHint";
import { ServiceCard } from "@/components/site/ServiceCard";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { BarberCard } from "@/components/site/BarberCard";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { FaqSection } from "@/components/site/FaqSection";
import { MapSection } from "@/components/site/MapSection";
import { useBarbers, useMedia, useServices, useSiteSettings } from "@/lib/site-content";
import { generalMessage, whatsappLink } from "@/lib/whatsapp";

const PHOTOS = {
  facadeNight: "/__l5e/assets-v1/eb4c7fbd-3a4e-4783-a8c1-04c85d384f35/image.png",
  bench: "/__l5e/assets-v1/5b54da88-7296-4cbd-8478-fcc2b61c675d/image-2.png",
  salon: "/__l5e/assets-v1/054af43b-54a3-4b87-825f-54908cbcc4aa/image-3.png",
  cut1: "/__l5e/assets-v1/9f074a80-73db-4814-96bd-b737d0023bff/image-4.png",
  cut2: "/__l5e/assets-v1/58f19a46-f10a-4f4c-8d12-fe410b9c2369/image-5.png",
  cut3: "/__l5e/assets-v1/9482cdef-33b6-479c-b409-abc1c811950f/image-6.png",
  facadeDay: "/__l5e/assets-v1/f5716d88-2e85-41de-8470-d7e809ca9e0c/image-7.png",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gireh Barber Shop — Barbearia em Rio das Ostras, RJ" },
      {
        name: "description",
        content:
          "Barbearia em Rio das Ostras (RJ): cortes, barba e acabamento com atendimento de alto padrão na Gireh Barber Shop. Agende seu horário pelo WhatsApp.",
      },
      { property: "og:title", content: "Gireh Barber Shop — Barbearia em Rio das Ostras, RJ" },
      {
        property: "og:description",
        content:
          "Seu estilo, sua identidade. Barbearia masculina de alto padrão em Rio das Ostras — RJ.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HairSalon",
          name: "Gireh Barber Shop",
          description: "Barbearia masculina em Rio das Ostras, RJ.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Alameda Campomar, 49",
            addressLocality: "Rio das Ostras",
            addressRegion: "RJ",
            addressCountry: "BR",
          },
          geo: { "@type": "GeoCoordinates", latitude: -22.5573108, longitude: -41.9796738 },
          telephone: "+5522998367510",
          sameAs: ["https://www.instagram.com/girehbarber/"],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: settings } = useSiteSettings();
  const { data: services = [] } = useServices();
  const { data: gallery = [] } = useMedia("galeria");
  const { data: barbers = [] } = useBarbers();
  const { data: media = [] } = useMedia();

  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());
  const location = settings?.location;
  const contact = settings?.contact;
  const hours = settings?.hours.items ?? [];

  const photos =
    gallery.length > 0
      ? gallery
          .filter((item) => item.media_type !== "video")
          .map((item) => ({ url: item.url, title: item.title || "Gireh Barber Shop" }))
      : [
          { url: PHOTOS.facadeDay, title: "Fachada" },
          { url: PHOTOS.salon, title: "Salão" },
          { url: PHOTOS.cut2, title: "Atendimento" },
          { url: PHOTOS.bench, title: "Bancada" },
        ];

  return (
    <SiteLayout flush>
      {/* HERO */}
      <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={settings?.brand.hero_media_url || PHOTOS.facadeNight}
          alt="Fachada da Gireh Barber Shop em Rio das Ostras"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-background/45" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-32 sm:pb-28">
          <p className="eyebrow fade-up">Rio das Ostras · RJ</p>
          <h1 className="fade-up mt-4 max-w-4xl text-[2.9rem] leading-[0.92] tracking-[0.01em] sm:text-7xl lg:text-8xl">
            {settings?.brand.hero_title || (
              <>
                SEU ESTILO.
                <br />
                <span className="text-gradient-gold">SUA IDENTIDADE.</span>
              </>
            )}
          </h1>
          <p className="fade-up mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {settings?.brand.hero_subtitle ||
              "Mais do que um corte. Uma experiência feita para quem valoriza estilo, presença e cuidado."}
          </p>
          <div className="fade-up mt-9 flex flex-wrap gap-3">
            {wa && (
              <Button asChild variant="gold" size="xl">
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" /> Agendar no WhatsApp
                </a>
              </Button>
            )}
            <Button asChild variant="outlineGold" size="xl">
              <Link to="/" hash="barbearia">
                Conhecer a Barbearia
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAIXA DE INFORMAÇÕES */}
      <section className="border-y border-primary/20 bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-3 md:items-center">
          <div className="flex min-w-0 gap-3">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="eyebrow">Onde estamos</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {location?.address
                  ? `${location.address} — ${location.city}/${location.state}`
                  : <EditableHint>Endereço a cadastrar</EditableHint>}
              </p>
            </div>
          </div>
          <div className="flex min-w-0 gap-3">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="eyebrow">Horários</p>
              <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                {hours.length === 0 && (
                  <li>
                    <EditableHint>Horários a cadastrar</EditableHint>
                  </li>
                )}
                {hours.map((item, index) => (
                  <li key={`${item.day}-${index}`}>
                    {item.day}: <span className="text-foreground">{item.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:justify-self-end">
            {location?.directions_url && (
              <Button asChild variant="outlineGold" size="lg">
                <a href={location.directions_url} target="_blank" rel="noreferrer">
                  <Navigation aria-hidden="true" /> Como chegar
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* A BARBEARIA */}
      <section id="barbearia" className="scroll-mt-24 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-2xl border border-border/70">
              <img
                src={PHOTOS.salon}
                alt="Salão interno da Gireh Barber Shop"
                loading="lazy"
                className="h-[340px] w-full object-cover sm:h-[460px]"
              />
            </div>
            <div className="absolute -bottom-10 right-2 hidden w-52 overflow-hidden rounded-2xl border border-primary/30 shadow-elegant sm:block lg:-right-8 lg:w-64">
              <img
                src={PHOTOS.bench}
                alt="Bancada de trabalho da barbearia"
                loading="lazy"
                className="h-40 w-full object-cover lg:h-48"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionLabel
              index="01"
              eyebrow="A Barbearia"
              title={settings?.brand.about_title || "TRADIÇÃO E PRECISÃO EM CADA DETALHE"}
              description={
                settings?.brand.about_text ||
                "Na Gireh Barber, cada detalhe importa. Do ambiente ao acabamento final, nossa proposta é proporcionar uma experiência completa para quem busca cuidar do visual com estilo e personalidade."
              }
            />
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border/60 pt-8">
              <div>
                <dt className="eyebrow">Ambiente</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  Climatizado, com som ambiente e lounge de espera.
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Atendimento</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  Profissionais atentos ao acabamento e ao seu tempo.
                </dd>
              </div>
            </dl>
            {wa && (
              <Button asChild variant="gold" className="mt-8">
                <a href={wa} target="_blank" rel="noreferrer">
                  Agendar horário <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            )}
          </Reveal>
        </div>
      </section>

      {/* EXPERIÊNCIA */}
      <ExperienceSection />

      {/* SERVIÇOS */}
      <section id="servicos" className="scroll-mt-24 border-y border-border/60 bg-surface/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index="02"
            eyebrow="Serviços"
            title="CORTE, BARBA E ACABAMENTO"
            description="Serviços e valores mantidos pela barbearia — atualizados diretamente no painel administrativo."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Reveal key={service.id}>
                <ServiceCard service={service} fallbackWhatsapp={contact?.whatsapp} />
              </Reveal>
            ))}
            {services.length === 0 && (
              <EditableHint>Serviços a cadastrar no painel administrativo</EditableHint>
            )}
          </div>
          <div className="mt-10">
            <Button asChild variant="outlineGold">
              <Link to="/servicos">Ver todos os serviços</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* BARBEIROS */}
      <section id="barbeiros" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index="03"
            eyebrow="Equipe"
            title="NOSSOS BARBEIROS"
            description="Quatro profissionais, quatro estilos. Veja os trabalhos e agende com quem combina com você."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {barbers.map((barber) => (
              <Reveal key={barber.id}>
                <BarberCard
                  barber={barber}
                  works={media.filter((item) => item.barber_id === barber.id && item.is_active)}
                />
              </Reveal>
            ))}
            {barbers.length === 0 && (
              <EditableHint>Barbeiros a cadastrar no painel administrativo</EditableHint>
            )}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index="03"
            eyebrow="Galeria"
            title="O ESPAÇO E O TRABALHO"
            description="Fotos reais da barbearia, do ambiente e do dia a dia no atendimento."
          />
          <Reveal className="mt-12">
            <GalleryGrid photos={photos} />
          </Reveal>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="border-y border-border/60 bg-surface/30 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <SectionLabel index="04" eyebrow="Instagram" title="ACOMPANHE @GIREHBARBER" />
            <p className="mt-4 max-w-xl text-muted-foreground">
              Novidades, cortes do dia e bastidores da barbearia direto no nosso perfil.
            </p>
          </div>
          {contact?.instagram && (
            <Button asChild variant="gold" size="xl">
              <a href={contact.instagram} target="_blank" rel="noreferrer">
                <Instagram aria-hidden="true" /> Seguir no Instagram
              </a>
            </Button>
          )}
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-4">
          {[PHOTOS.cut1, PHOTOS.cut2, PHOTOS.cut3, PHOTOS.facadeDay].map((src) => (
            <img
              key={src}
              src={src}
              alt="Publicação da Gireh Barber Shop"
              loading="lazy"
              className="aspect-square w-full rounded-xl border border-border/70 object-cover"
            />
          ))}
        </div>
      </section>

      {/* LOCALIZAÇÃO / CONTATO */}
      <section id="contato" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index="05"
            eyebrow="Contato"
            title="VENHA NOS VISITAR"
            description={
              location?.address
                ? `${location.address} — ${location.city}/${location.state}`
                : "Endereço a cadastrar no painel administrativo."
            }
          />
          <div id="localizacao" className="mt-10 scroll-mt-24">
            <MapSection />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {wa && (
              <Button asChild variant="gold" size="lg">
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" /> Falar no WhatsApp
                </a>
              </Button>
            )}
            {location?.directions_url && (
              <Button asChild variant="outlineGold" size="lg">
                <a href={location.directions_url} target="_blank" rel="noreferrer">
                  <Navigation aria-hidden="true" /> Traçar rota
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />
    </SiteLayout>
  );
}
