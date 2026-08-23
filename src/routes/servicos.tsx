import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { EditableHint } from "@/components/site/EditableHint";
import { InfoStrip } from "@/components/site/InfoStrip";
import { useServices, useSiteSettings } from "@/lib/site-content";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Girih Barbearia | Rio das Ostras, RJ" },
      {
        name: "description",
        content:
          "Conheça os serviços da Girih Barbearia em Rio das Ostras: corte, barba e cuidados masculinos, com duração e valores. Agende pelo WhatsApp.",
      },
      { property: "og:title", content: "Serviços — Girih Barbearia" },
      {
        property: "og:description",
        content: "Corte, barba e cuidados masculinos em Rio das Ostras (RJ).",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services = [] } = useServices();
  const { data: settings } = useSiteSettings();

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Serviços"
          title="Cortes, barba e cuidados"
          description="Cada serviço tem foto, descrição, duração e valor — tudo editável no painel administrativo."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              fallbackWhatsapp={settings?.contact.whatsapp}
            />
          ))}
          {services.length === 0 && (
            <EditableHint>Nenhum serviço cadastrado ainda no painel administrativo.</EditableHint>
          )}
        </div>
      </section>
      <InfoStrip />
    </SiteLayout>
  );
}
