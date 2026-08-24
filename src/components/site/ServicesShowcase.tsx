import { Button } from "@/components/ui/button";
import { SectionLabel } from "./SectionLabel";
import { ServiceCard } from "./ServiceCard";
import { EditableHint } from "./EditableHint";
import { Reveal } from "./Reveal";
import { useServices, useSiteSettings } from "@/lib/site-content";
import { generalMessage, whatsappLink } from "@/lib/whatsapp";

/**
 * Vitrine pública de serviços e preços.
 * Fonte única de dados: tabela `services` (mesma usada pelo painel administrativo).
 * Somente serviços com "Ativo = sim" aparecem aqui.
 */
export function ServicesShowcase({
  index = "02",
  showCta = true,
}: {
  index?: string;
  showCta?: boolean;
}) {
  const { data: services = [] } = useServices();
  const { data: settings } = useSiteSettings();
  const whatsapp = settings?.contact.whatsapp;
  const ctaHref = whatsappLink(whatsapp, generalMessage());

  return (
    <section id="servicos" className="scroll-mt-24 border-y border-border/60 bg-surface/30 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionLabel
          index={index}
          eyebrow="Serviços & Preços"
          title="NOSSOS SERVIÇOS"
          description="Seu estilo merece atenção aos detalhes."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Reveal key={service.id}>
              <ServiceCard service={service} fallbackWhatsapp={whatsapp} />
            </Reveal>
          ))}
          {services.length === 0 && (
            <EditableHint>Serviços a cadastrar no painel administrativo</EditableHint>
          )}
        </div>

        {showCta && (
          <Reveal>
            <div className="mt-14 flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-background/60 px-6 py-12 text-center">
              <h3 className="text-3xl uppercase leading-tight sm:text-4xl">
                Pronto para renovar o visual?
              </h3>
              <p className="max-w-xl text-muted-foreground">
                Escolha seu serviço e agende seu horário com a Gireh Barber.
              </p>
              {ctaHref ? (
                <Button asChild size="lg" className="mt-2 h-12 tracking-[0.18em]">
                  <a href={ctaHref} target="_blank" rel="noreferrer">
                    AGENDAR MEU HORÁRIO
                  </a>
                </Button>
              ) : (
                <EditableHint>
                  Cadastre o WhatsApp no painel para ativar o agendamento
                </EditableHint>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
