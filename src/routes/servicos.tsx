import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServicesShowcase } from "@/components/site/ServicesShowcase";
import { InfoStrip } from "@/components/site/InfoStrip";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços e Preços — Gireh Barber | Rio das Ostras, RJ" },
      {
        name: "description",
        content:
          "Veja os serviços da Gireh Barber em Rio das Ostras: corte, barba e cuidados masculinos, com duração e valores. Agende pelo WhatsApp.",
      },
      { property: "og:title", content: "Serviços e Preços — Gireh Barber" },
      {
        property: "og:description",
        content: "Corte, barba e cuidados masculinos em Rio das Ostras (RJ).",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <ServicesShowcase index="01" />
      <InfoStrip />
    </SiteLayout>
  );
}
