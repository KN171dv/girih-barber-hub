import { Compass, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableHint } from "./EditableHint";
import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";
import { useSiteSettings } from "@/lib/site-content";
import { panoramaEmbedUrl, panoramaExternalUrl } from "@/lib/maps";

/** Seção "Conheça nosso espaço" com panorama 360° do Google Maps (link editável no painel). */
export function VirtualTour({ index = "05" }: { index?: string }) {
  const { data: settings } = useSiteSettings();
  const location = settings?.location;

  const embedUrl = panoramaEmbedUrl(
    location?.panorama_360_url,
    location?.latitude,
    location?.longitude,
  );
  const externalUrl = panoramaExternalUrl(
    location?.panorama_360_url,
    location?.latitude,
    location?.longitude,
  );

  return (
    <section
      id="espaco"
      className="scroll-mt-24 border-y border-border/60 bg-surface/30 py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.35fr] lg:items-center">
          <Reveal>
            <SectionLabel
              index={index}
              eyebrow="Visita virtual"
              title={
                <>
                  CONHEÇA NOSSO <span className="text-gradient-gold">ESPAÇO</span>
                </>
              }
              description="Arraste para girar o panorama 360° e percorra a barbearia antes mesmo de chegar: o lounge de espera, o ambiente climatizado e as cadeiras de atendimento."
            />
            {externalUrl && (
              <div className="mt-8">
                <Button asChild variant="outlineGold">
                  <a href={externalUrl} target="_blank" rel="noreferrer">
                    <Maximize2 aria-hidden="true" /> Abrir em tela cheia
                  </a>
                </Button>
              </div>
            )}
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl border border-border shadow-elegant">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Panorama 360° da Gireh Barber Shop"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[320px] w-full sm:h-[440px]"
                />
              ) : (
                <div className="flex h-[320px] flex-col items-center justify-center gap-3 bg-background/60 text-center">
                  <Compass className="h-8 w-8 text-primary" aria-hidden="true" />
                  <EditableHint>Link do panorama 360° a cadastrar no painel</EditableHint>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
