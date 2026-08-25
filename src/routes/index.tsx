import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Navigation, ArrowRight, View } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { EditableHint } from "@/components/site/EditableHint";
import { QuickInfoBar } from "@/components/site/QuickInfoBar";
import { ServicesShowcase } from "@/components/site/ServicesShowcase";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { BarberCard } from "@/components/site/BarberCard";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { PlansShowcase } from "@/components/site/PlansShowcase";
import { FinalCta } from "@/components/site/FinalCta";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";

import { FaqSection } from "@/components/site/FaqSection";
import { MapSection } from "@/components/site/MapSection";
import { useBarbers, useMedia, useSiteSettings } from "@/lib/site-content";
import { generalMessage, onlyDigits, whatsappLink } from "@/lib/whatsapp";

const PHOTOS = {
  facadeNight: "/__l5e/assets-v1/eb4c7fbd-3a4e-4783-a8c1-04c85d384f35/image.png",
  bench: "/__l5e/assets-v1/5b54da88-7296-4cbd-8478-fcc2b61c675d/image-2.png",
  salon: "/__l5e/assets-v1/054af43b-54a3-4b87-825f-54908cbcc4aa/image-3.png",
  cut1: "/__l5e/assets-v1/9f074a80-73db-4814-96bd-b737d0023bff/image-4.png",
  cut2: "/__l5e/assets-v1/58f19a46-f10a-4f4c-8d12-fe410b9c2369/image-5.png",
  cut3: "/__l5e/assets-v1/9482cdef-33b6-479c-b409-abc1c811950f/image-6.png",
  facadeDay: "/__l5e/assets-v1/f5716d88-2e85-41de-8470-d7e809ca9e0c/image-7.png",
};

function formatPhone(value: string) {
  const digits = onlyDigits(value).replace(/^55/, "");
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value;
}

const TITLE = "Gireh Barber Shop | Barbearia em Rio das Ostras – RJ";
const DESCRIPTION =
  "Barbearia em Rio das Ostras (RJ): corte, barba e acabamento com atendimento de alto padrão na Gireh Barber Shop. Agende seu horário pelo WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://girih-barber-hub.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://girih-barber-hub.lovable.app/" }],
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
  const { data: gallery = [] } = useMedia("galeria");
  const { data: barbers = [] } = useBarbers();
  const { data: media = [] } = useMedia();

  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());
  const location = settings?.location;
  const contact = settings?.contact;
  const heroHours = settings?.hours.items?.[0];
  const heroMedia = settings?.brand.hero_media_url;
  const heroVideo = heroMedia && /\.(mp4|webm|mov)(\?|$)/i.test(heroMedia) ? heroMedia : null;

  const heroSlidesRaw = [
    ...(heroMedia && !heroVideo ? [{ url: heroMedia, alt: "Gireh Barber Shop" }] : []),
    { url: PHOTOS.facadeNight, alt: "Fachada da Gireh Barber Shop à noite" },
    { url: PHOTOS.salon, alt: "Salão interno da Gireh Barber Shop" },
    { url: PHOTOS.cut1, alt: "Barbeiro atendendo cliente na Gireh" },
    { url: PHOTOS.bench, alt: "Bancada de trabalho da Gireh" },
    { url: PHOTOS.facadeDay, alt: "Fachada da Gireh Barber Shop durante o dia" },
  ];
  const heroSlides = heroSlidesRaw.filter(
    (slide, index) => heroSlidesRaw.findIndex((s) => s.url === slide.url) === index,
  );

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
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <HeroSlideshow images={heroSlides} videoUrl={heroVideo} />

        <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-32 sm:pb-20">
          <div className="fade-up flex items-center gap-4">
            <span className="h-px w-12 bg-primary sm:w-20" aria-hidden="true" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
              11 anos de estilo, tradição e excelência
            </p>
          </div>
          <p className="eyebrow fade-up mt-4">Gireh Barber Shop · Desde 2015</p>
          <h1 className="fade-up mt-5 max-w-4xl text-[2.75rem] uppercase leading-[0.92] tracking-[0.01em] sm:text-7xl lg:text-8xl">
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
              "Corte, barba e acabamento com padrão de excelência em Rio das Ostras. Um ambiente pensado para quem valoriza presença, estilo e cuidado em cada detalhe."}
          </p>
          <div className="fade-up mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {wa && (
              <Button asChild variant="gold" size="xl" className="tracking-[0.16em]">
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" /> AGENDAR AGORA
                </a>
              </Button>
            )}
            <Button asChild variant="outlineGold" size="xl" className="tracking-[0.16em]">
              <Link to="/" hash="barbearia">
                CONHECER A BARBEARIA
              </Link>
            </Button>
          </div>

          {/* Linha inferior com informações reais */}
          <div className="fade-up mt-12 border-t border-border/50 pt-6">
            <dl className="grid gap-5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:grid-cols-3">
              <div className="min-w-0">
                <dt className="text-primary">Onde estamos</dt>
                <dd className="mt-2 truncate text-foreground">
                  {location?.city
                    ? `${location.city}${location.state ? ` — ${location.state}` : ""}`
                    : "Rio das Ostras — RJ"}
                </dd>
              </div>
              {heroHours && (
                <div className="min-w-0">
                  <dt className="text-primary">{heroHours.day}</dt>
                  <dd className="mt-2 truncate text-foreground">{heroHours.hours}</dd>
                </div>
              )}
              {contact?.whatsapp && (
                <div className="min-w-0">
                  <dt className="text-primary">WhatsApp</dt>
                  <dd className="mt-2 truncate text-foreground">{formatPhone(contact.whatsapp)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>


      {/* INFORMAÇÕES RÁPIDAS */}
      <QuickInfoBar />

      {/* 01 — A BARBEARIA */}
      <section id="barbearia" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <Reveal className="relative">
            <div className="group overflow-hidden rounded-2xl border border-border/70">
              <img
                src={PHOTOS.salon}
                alt="Salão interno da Gireh Barber Shop, com cadeiras de barbeiro"
                loading="lazy"
                className="h-[360px] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] sm:h-[520px]"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionLabel
              index="01"
              eyebrow="A Barbearia"
              title={settings?.brand.about_title || "TRADIÇÃO, ESTILO E PRECISÃO EM CADA DETALHE"}
              description={
                settings?.brand.about_text ||
                "Na Gireh, cada detalhe faz parte da experiência. Do ambiente ao acabamento final, criamos um espaço para quem entende que cuidar do visual também é cuidar da própria presença."
              }
            />
            {wa && (
              <Button asChild variant="gold" size="lg" className="mt-10 tracking-[0.16em]">
                <a href={wa} target="_blank" rel="noreferrer">
                  AGENDAR HORÁRIO <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            )}
          </Reveal>
        </div>
      </section>

      {/* A EXPERIÊNCIA GIREH */}
      <ExperienceSection />

      {/* 02 — SERVIÇOS */}
      <ServicesShowcase index="02" showCta={false} />

      {/* 03 — EQUIPE */}
      <section id="barbeiros" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index="03"
            eyebrow="Equipe"
            title="NOSSOS BARBEIROS"
            description="Quatro profissionais, quatro estilos. Veja os trabalhos e agende com quem combina com você."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {barbers.map((barber, index) => (
              <Reveal key={barber.id} delay={index * 70}>
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

      {/* 04 — GALERIA */}
      <section id="galeria" className="scroll-mt-24 border-y border-border/60 bg-surface/20 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index="04"
            eyebrow="Galeria"
            title="O ESPAÇO E O TRABALHO"
            description="Um pouco da nossa rotina, do ambiente e dos trabalhos feitos todos os dias na Gireh."
          />
          <Reveal className="mt-12">
            <GalleryGrid photos={photos} />
          </Reveal>
        </div>
      </section>

      {/* 05 — INSTAGRAM */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <SectionLabel
              index="05"
              eyebrow="Instagram"
              title="ACOMPANHE A GIREH"
              description="Cortes, transformações, bastidores e o dia a dia da barbearia."
            />
          </div>
          {contact?.instagram && (
            <Button asChild variant="outlineGold" size="xl" className="tracking-[0.16em]">
              <a href={contact.instagram} target="_blank" rel="noreferrer">
                <Instagram aria-hidden="true" /> SEGUIR NO INSTAGRAM
              </a>
            </Button>
          )}
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-4">
          {[PHOTOS.cut1, PHOTOS.cut2, PHOTOS.cut3, PHOTOS.facadeDay].map((src) => (
            <div key={`${src}-${i}`} className="overflow-hidden rounded-xl border border-border/70">
              <img
                src={src}
                alt="Atendimento e ambiente da Gireh Barber Shop"
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.05]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* PLANOS */}
      <PlansShowcase />

      {/* 06 — LOCALIZAÇÃO */}
      <section id="contato" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index="06"
            eyebrow="Localização"
            title="VENHA VIVER A EXPERIÊNCIA GIREH"
            description={
              location?.address
                ? `${location.address} — ${location.city}/${location.state}`
                : "Endereço a cadastrar no painel administrativo."
            }
          />
          <div id="localizacao" className="mt-10 scroll-mt-24">
            <MapSection />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {location?.directions_url && (
              <Button asChild variant="gold" size="lg" className="tracking-[0.16em]">
                <a href={location.directions_url} target="_blank" rel="noreferrer">
                  <Navigation aria-hidden="true" /> COMO CHEGAR
                </a>
              </Button>
            )}
            {wa && (
              <Button asChild variant="outlineGold" size="lg" className="tracking-[0.16em]">
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" /> AGENDAR HORÁRIO
                </a>
              </Button>
            )}
            {location?.panorama_360_url && (
              <Button asChild variant="ghost" size="lg" className="tracking-[0.16em]">
                <a href={location.panorama_360_url} target="_blank" rel="noreferrer">
                  <View aria-hidden="true" /> CONHEÇA NOSSO ESPAÇO EM 360°
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA FINAL */}
      <FinalCta backgroundUrl={PHOTOS.facadeNight} />
    </SiteLayout>
  );
}
