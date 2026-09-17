import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { Instagram, MessageCircle, ArrowRight, MapPin, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionLabel } from "@/components/site/SectionLabel";
import { Reveal } from "@/components/site/Reveal";
import { EditableHint } from "@/components/site/EditableHint";
import { QuickInfoBar } from "@/components/site/QuickInfoBar";
import { CraftSection, type CraftItem } from "@/components/site/CraftSection";
import { ServiceStorySection } from "@/components/site/ServiceStorySection";
import { ServicesShowcase } from "@/components/site/ServicesShowcase";
import { StatsSection } from "@/components/site/StatsSection";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { BeforeAfterGallery } from "@/components/site/BeforeAfterGallery";
import { BarberCard } from "@/components/site/BarberCard";
import { PlansCarousel } from "@/components/site/PlansCarousel";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { FinalCta } from "@/components/site/FinalCta";
import { ScrollVideoIntro } from "@/components/site/ScrollVideoIntro";
import { HeroAmbientVideo } from "@/components/site/HeroAmbientVideo";

import { FaqSection } from "@/components/site/FaqSection";
import { LocationBlock } from "@/components/site/LocationBlock";
import { useBarbers, useMedia, useServices, useSiteSettings } from "@/lib/site-content";
import { generalMessage, onlyDigits, whatsappLink } from "@/lib/whatsapp";
import { EASE_SMOOTH } from "@/lib/motion";
import { plans as staticPlans } from "@/data/plans";

const SCROLL_INTRO_VIDEO_SRC = "/upload/scroll.mp4";
const HERO_AMBIENT_VIDEO_SRC = "/upload/poshero.mp4";

const PHOTOS = {
  facade: "/upload/shop-facade.png",
  salon: "/upload/shop-salon-wide.png",
  salonChairs: "/upload/shop-salon-chairs.png",
  waitingArea: "/upload/shop-waiting-area.png",
  benchTools: "/upload/shop-bench-tools.png",
};

// Fotos de banco de imagens gratuito (Pexels, licença de uso comercial livre)
// — usadas onde ainda não temos fotos reais específicas pra cada item.
const STOCK = {
  craftTesoura: "/upload/stock/craft-tesoura.jpg",
  craftNavalha: "/upload/stock/craft-navalha.jpg",
  craftMaquina: "/upload/stock/craft-maquina.jpg",
};

const CRAFT_ITEMS: CraftItem[] = [
  {
    title: "Tesoura",
    text: "O primeiro corte é sempre com a tesoura. Fio afiado à mão, ângulo certo, movimento contido — é isso que dá contorno e textura ao cabelo, sem atalho.",
    image: STOCK.craftTesoura,
    imageAlt: "Barbeiro penteando e finalizando o corte degradê de um cliente",
  },
  {
    title: "Navalha",
    text: "Depois vem a navalha, para o acabamento que só ela faz: contorno limpo na nuca, na testa, no desenho da barba. Precisão que não deixa margem para erro.",
    image: STOCK.craftNavalha,
    imageAlt: "Navalha de barbeiro com cabo de madeira sobre uma bancada",
  },
  {
    title: "Máquina",
    text: "Por último, a máquina entra para o degradê — a transição entre comprimentos exige calibragem de lâmina e leveza de mão para não deixar marca.",
    image: STOCK.craftMaquina,
    imageAlt: "Barbeiro usando máquina de corte no cabelo de um cliente",
  },
];

function formatPhone(value: string) {
  const digits = onlyDigits(value).replace(/^55/, "");
  if (digits.length === 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value;
}

const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_SMOOTH } },
};

const TITLE = "Gireh Barber Shop | Barbearia em Rio das Ostras – RJ";
const DESCRIPTION =
  "Barbearia em Rio das Ostras (RJ): corte, barba e acabamento com atendimento de alto padrão na Gireh Barber Shop. Agende seu horário pelo WhatsApp.";
// URL real de produção — troque aqui se o domínio mudar (ex.: domínio próprio).
const SITE_URL = "https://girih-barber-hub.vercel.app/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
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
  const { data: beforeAfter = [] } = useMedia("antes_depois");
  const { data: barbers = [] } = useBarbers();
  const { data: media = [] } = useMedia();
  const { data: services = [] } = useServices();

  // A seção de Planos some quando não há planos cadastrados (ver
  // src/data/plans.ts) — as duas seções seguintes se renumeram sozinhas.
  const hasPlans = staticPlans.some((plan) => plan.is_active);
  const plansIndex = "07";
  const galleryIndex = hasPlans ? "08" : "07";
  const locationIndex = hasPlans ? "09" : "08";

  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());
  const location = settings?.location;
  const contact = settings?.contact;
  const heroHours = settings?.hours.items?.[0];

  const photos =
    gallery.length > 0
      ? gallery
          .filter((item) => item.media_type !== "video")
          .map((item) => ({ url: item.url, title: item.title || "Gireh Barber Shop" }))
      : [
          { url: PHOTOS.facade, title: "Fachada" },
          { url: PHOTOS.salon, title: "Salão" },
          { url: PHOTOS.salonChairs, title: "Cadeiras" },
          { url: PHOTOS.waitingArea, title: "Recepção" },
          { url: PHOTOS.benchTools, title: "Bancada" },
        ];

  return (
    <SiteLayout flush initialHeaderHidden>
      {/* FASE 1 — INTRODUÇÃO EM VÍDEO (pinada, sem texto) */}
      <ScrollVideoIntro src={SCROLL_INTRO_VIDEO_SRC} poster={PHOTOS.facade} />

      {/* FASE 2 — HERO */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <HeroAmbientVideo src={HERO_AMBIENT_VIDEO_SRC} poster={PHOTOS.salon} />

        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-6xl px-5 pb-12 pt-28 text-center sm:px-4 sm:pb-20 sm:pt-32 sm:text-left"
        >
          <motion.div
            variants={heroItem}
            className="flex items-center justify-center gap-3 sm:justify-start sm:gap-4"
          >
            <span className="h-px w-12 bg-primary sm:w-20" aria-hidden="true" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-[11px]">
              Gireh Barber Shop · Desde 2015
            </p>
          </motion.div>
          <motion.h1
            variants={heroItem}
            className="mx-auto mt-5 max-w-4xl text-[2rem] leading-[1.08] tracking-[0.01em] sm:mx-0 sm:mt-6 sm:text-6xl sm:leading-[1.02] lg:text-7xl"
          >
            11 Anos de Estilo,
            <br />
            <span className="text-gradient-gold">Tradição e Excelência</span>
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mx-0 sm:mt-5 sm:text-lg"
          >
            A Arte de Ser Clássico, a Liberdade de Ser Moderno
          </motion.p>
          <motion.div
            variants={heroItem}
            className="mt-7 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center"
          >
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
          </motion.div>

          {/* Linha inferior com informações reais */}
          <motion.div
            variants={heroItem}
            className="mt-9 border-t border-border/50 pt-5 sm:mt-12 sm:pt-6"
          >
            <dl className="grid gap-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:grid-cols-3 sm:gap-5 sm:divide-x sm:divide-border/50 sm:text-[11px] sm:tracking-[0.2em]">
              <div className="min-w-0 sm:pr-6">
                <dt className="flex items-center justify-center gap-2 text-primary sm:justify-start">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Onde estamos
                </dt>
                <dd className="mt-2 truncate text-foreground">
                  {location?.city
                    ? `${location.city}${location.state ? ` — ${location.state}` : ""}`
                    : "Rio das Ostras — RJ"}
                </dd>
              </div>
              {heroHours && (
                <div className="min-w-0 sm:px-6">
                  <dt className="flex items-center justify-center gap-2 text-primary sm:justify-start">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Horário
                  </dt>
                  <dd className="mt-2 truncate text-foreground">
                    {heroHours.day}: {heroHours.hours}
                  </dd>
                </div>
              )}
              {contact?.whatsapp && (
                <div className="min-w-0 sm:pl-6">
                  <dt className="flex items-center justify-center gap-2 text-primary sm:justify-start">
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> Agendamento
                  </dt>
                  <dd className="mt-2 truncate text-foreground">{formatPhone(contact.whatsapp)}</dd>
                </div>
              )}
            </dl>
          </motion.div>
        </motion.div>
      </section>

      {/* 01 — A BARBEARIA */}
      <section id="barbearia" className="scroll-mt-24 section-y">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <Reveal className="relative">
            <div className="group overflow-hidden rounded-2xl border border-border/70">
              <img
                src={PHOTOS.salon}
                alt="Salão da Gireh Barber Shop, com cadeiras de barbeiro e ambiente decorado"
                loading="lazy"
                className="h-[260px] w-full object-cover sm:h-[360px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] sm:h-[520px]"
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
              <Button
                asChild
                variant="gold"
                size="lg"
                className="mt-7 w-full tracking-[0.16em] sm:mt-10 sm:w-auto"
              >
                <a href={wa} target="_blank" rel="noreferrer">
                  AGENDAR HORÁRIO <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            )}
          </Reveal>
        </div>
      </section>

      {/* 02 — O OFÍCIO */}
      <CraftSection index="02" items={CRAFT_ITEMS} />

      {/* 03 — SERVIÇOS EM DESTAQUE + TABELA DE PREÇOS */}
      <ServiceStorySection
        index="03"
        services={services}
        fallbackImage={PHOTOS.benchTools}
        fallbackWhatsapp={contact?.whatsapp}
      />
      <ServicesShowcase variant="compact" showCta={false} />

      {/* 04 — NÚMEROS */}
      <StatsSection index="04" />

      {/* 05 — EQUIPE */}
      <section id="barbeiros" className="scroll-mt-24 section-y">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index="05"
            eyebrow="Equipe"
            title="NOSSOS BARBEIROS"
            description="Quatro profissionais, quatro estilos. Veja os trabalhos e agende com quem combina com você."
          />
          <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {barbers.map((barber, index) => (
              <Reveal key={barber.id} delay={index * 70}>
                <BarberCard
                  barber={barber}
                  works={media.filter((item) => item.barber_id === barber.id && item.is_active)}
                />
              </Reveal>
            ))}
            {barbers.length === 0 && (
              <EditableHint>Barbeiros a cadastrar em src/data/barbers.ts</EditableHint>
            )}
          </div>
        </div>
      </section>

      {/* 06 — DEPOIMENTOS (conteúdo de exemplo — ver aviso em TestimonialsSection.tsx) */}
      <TestimonialsSection index="06" />

      {/* PLANOS & ASSINATURAS (oculta automaticamente se não houver planos) */}
      <PlansCarousel index={plansIndex} />

      {/* GALERIA */}
      <section
        id="galeria"
        className="scroll-mt-24 border-y border-border/60 bg-surface/20 section-y"
      >
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index={galleryIndex}
            eyebrow="Galeria"
            title="TRANSFORMAÇÕES E O DIA A DIA"
            description="Um pouco da nossa rotina, do ambiente e dos trabalhos feitos todos os dias na Gireh."
          />

          {beforeAfter.length > 1 && (
            <div className="mt-10 sm:mt-14">
              <Reveal>
                <p className="eyebrow">Antes & Depois</p>
              </Reveal>
              <div className="mt-5">
                <BeforeAfterGallery items={beforeAfter} />
              </div>
            </div>
          )}

          <div className="mt-10 sm:mt-14">
            <Reveal>
              <p className="eyebrow">O Espaço e o Trabalho</p>
            </Reveal>
            <Reveal className="mt-5">
              <GalleryGrid photos={photos} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="section-y">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-6 px-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <SectionLabel
              eyebrow="Instagram"
              title="ACOMPANHE A GIREH"
              description="Cortes, transformações, bastidores e o dia a dia da barbearia."
            />
          </div>
          {contact?.instagram && (
            <Button
              asChild
              variant="outlineGold"
              size="xl"
              className="w-full whitespace-normal px-4 text-[10px] tracking-[0.12em] sm:text-xs lg:w-auto lg:tracking-[0.16em]"
            >
              <a href={contact.instagram} target="_blank" rel="noreferrer">
                <Instagram aria-hidden="true" /> SEGUIR NO INSTAGRAM
              </a>
            </Button>
          )}
        </div>
        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:mt-12 sm:grid-cols-4">
          {[PHOTOS.facade, PHOTOS.salonChairs, PHOTOS.waitingArea, PHOTOS.benchTools].map(
            (src, i) => (
              <div
                key={`${src}-${i}`}
                className="overflow-hidden rounded-xl border border-border/70"
              >
                <img
                  src={src}
                  alt="Atendimento e ambiente da Gireh Barber Shop"
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.05]"
                />
              </div>
            ),
          )}
        </div>
      </section>

      {/* FAIXA DE INFORMAÇÕES */}
      <QuickInfoBar />

      {/* LOCALIZAÇÃO */}
      <section id="contato" className="scroll-mt-24 section-y">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel
            index={locationIndex}
            eyebrow="Localização"
            title="VENHA VIVER A EXPERIÊNCIA GIREH"
          />
          <div id="localizacao" className="mt-8 scroll-mt-24 sm:mt-10">
            <LocationBlock />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA FINAL */}
      <FinalCta backgroundUrl={PHOTOS.facade} />
    </SiteLayout>
  );
}
