import { Button } from "@/components/ui/button";
import { SectionLabel } from "./SectionLabel";
import { ServiceCard } from "./ServiceCard";
import { EditableHint } from "./EditableHint";
import { Reveal } from "./Reveal";
import { useServices, useSiteSettings } from "@/lib/site-content";
import { generalMessage, whatsappLink } from "@/lib/whatsapp";

/**
 * Tabela de preços: todos os serviços cadastrados, com duração e valor.
 * Fonte única de dados: src/data/services.ts.
 * Somente serviços com "Ativo = sim" aparecem aqui.
 *
 * `variant="compact"` mostra um subtítulo discreto (usado logo após o
 * showcase individual de serviços, na home). `variant="full"` (padrão)
 * mostra o cabeçalho completo de seção — usado na página /servicos.
 */
export function ServicesShowcase({
  index,
  showCta = true,
  variant = "full",
}: {
  index?: string;
  showCta?: boolean;
  variant?: "full" | "compact";
}) {
  const { data: services = [] } = useServices();
  const { data: settings } = useSiteSettings();
  const whatsapp = settings?.contact.whatsapp;
  const ctaHref = whatsappLink(whatsapp, generalMessage());

  return (
    <section
      id={variant === "full" ? "servicos" : undefined}
      className="scroll-mt-24 border-y border-border/60 bg-surface/30"
    >
      <div
        className={
          variant === "full"
            ? "mx-auto max-w-6xl px-4 section-y"
            : "mx-auto max-w-6xl px-4 section-y-sm"
        }
      >
        {variant === "full" ? (
          <SectionLabel
            {...(index ? { index } : {})}
            eyebrow="Serviços"
            title="CORTE, BARBA E CUIDADO EM CADA DETALHE"
            description="Escolha seu serviço e agende seu horário."
          />
        ) : (
          <Reveal className="mx-auto max-w-2xl text-center sm:mx-0 sm:text-left">
            <span className="eyebrow">Tabela de Preços</span>
            <h3 className="mt-3 text-2xl uppercase tracking-[0.04em] sm:text-3xl">
              Valores e duração
            </h3>
          </Reveal>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-5 sm:mt-12 sm:gap-6">
          {services.map((service) => (
            <Reveal
              key={service.id}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]"
            >
              <ServiceCard service={service} fallbackWhatsapp={whatsapp} />
            </Reveal>
          ))}
          {services.length === 0 && (
            <EditableHint>Serviços a cadastrar em src/data/services.ts</EditableHint>
          )}
        </div>

        {showCta && (
          <Reveal>
            <div className="mt-10 flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-background/60 px-5 py-10 text-center sm:mt-14 sm:px-6 sm:py-12">
              <h3 className="text-2xl uppercase leading-tight sm:text-3xl lg:text-4xl">
                Pronto para renovar o visual?
              </h3>
              <p className="max-w-xl text-muted-foreground">
                Escolha seu serviço e agende seu horário com a Gireh Barber.
              </p>
              {ctaHref ? (
                <Button asChild size="lg" className="mt-2 h-12 w-full tracking-[0.18em] sm:w-auto">
                  <a href={ctaHref} target="_blank" rel="noreferrer">
                    AGENDAR MEU HORÁRIO
                  </a>
                </Button>
              ) : (
                <EditableHint>
                  Cadastre o WhatsApp em src/data/site-settings.ts para ativar o agendamento
                </EditableHint>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
