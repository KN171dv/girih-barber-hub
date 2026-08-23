import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { MapSection } from "@/components/site/MapSection";
import { VirtualTour } from "@/components/site/VirtualTour";
import { EditableHint } from "@/components/site/EditableHint";
import { useSiteSettings } from "@/lib/site-content";

export const Route = createFileRoute("/localizacao")({
  head: () => ({
    meta: [
      { title: "Localização e horários — Girih Barbearia | Rio das Ostras" },
      {
        name: "description",
        content:
          "Girih Barbearia fica na Alameda Campomar, 49, Cidade Praiana, Rio das Ostras (RJ). Veja o mapa, trace a rota e confira os horários de atendimento.",
      },
      { property: "og:title", content: "Localização — Girih Barbearia" },
      {
        property: "og:description",
        content: "Alameda Campomar, 49 — Cidade Praiana, Rio das Ostras (RJ).",
      },
    ],
  }),
  component: LocationPage,
});

function LocationPage() {
  const { data: settings } = useSiteSettings();
  const note = settings?.hours.note;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Onde estamos"
          title="Rio das Ostras, RJ"
          description="Estamos no bairro Cidade Praiana. Use o botão de rota para chegar com facilidade."
        />
        <div className="mt-10">
          <MapSection />
        </div>
        {note && (
          <p className="mt-6 text-xs text-muted-foreground">
            <EditableHint>{note}</EditableHint>
          </p>
        )}
      </section>

      <VirtualTour />
    </SiteLayout>
  );
}
