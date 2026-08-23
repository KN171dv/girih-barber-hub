import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BarberCard } from "@/components/site/BarberCard";
import { EditableHint } from "@/components/site/EditableHint";
import { InfoStrip } from "@/components/site/InfoStrip";
import { useBarbers } from "@/lib/site-content";

export const Route = createFileRoute("/barbeiros/")({
  head: () => ({
    meta: [
      { title: "Nossos barbeiros — Girih Barbearia | Rio das Ostras" },
      {
        name: "description",
        content:
          "Conheça os barbeiros da Girih Barbearia em Rio das Ostras: especialidades, apresentação e portfólio de trabalhos. Agende com o profissional que preferir.",
      },
      { property: "og:title", content: "Nossos barbeiros — Girih Barbearia" },
      {
        property: "og:description",
        content: "Equipe da Girih Barbearia: especialidades, portfólio e agendamento direto.",
      },
    ],
  }),
  component: BarbersPage,
});

function BarbersPage() {
  const { data: barbers = [] } = useBarbers();
  const { data: media = [] } = useMedia();

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Equipe"
          title="Nossos barbeiros"
          description="Escolha o profissional, veja o portfólio e agende direto pelo WhatsApp dele."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((barber) => (
            <BarberCard
              key={barber.id}
              barber={barber}
              works={media.filter((item) => item.barber_id === barber.id && item.is_active)}
            />
          ))}
          {barbers.length === 0 && (
            <EditableHint>Barbeiros a cadastrar no painel administrativo</EditableHint>
          )}
        </div>
      </section>
      <InfoStrip />
    </SiteLayout>
  );
}
