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
    <section id="espaco" className="scroll-mt-24 border-y border-border/60 bg-surface/30">
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-10">
        <Reveal>
          <SectionLabel
            index={index}
            eyebrow="Visita virtual"
            title={
              <>
                CONHEÇA NOSSO <span className="text-gradient-gold">ESPAÇO</span>
              </>
            }
            description="Arraste para girar o panorama 360° e percorra a barbearia antes mesmo de chegar."
            align="center"
          />
        </Reveal>
      </div>

      <Reveal delay={120}>
        <div className="relative w-full">
          {embedUrl ? (
            <>
              <iframe
                src={embedUrl}
                title="Panorama 360° da Gireh Barber Shop"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[70vh] min-h-[420px] w-full border-y border-border"
              />
              {externalUrl && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-6">
                  <Button asChild variant="outlineGold" className="pointer-events-auto backdrop-blur">
                    <a href={externalUrl} target="_blank" rel="noreferrer">
                      <Maximize2 aria-hidden="true" /> Abrir em tela cheia
                    </a>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-[420px] flex-col items-center justify-center gap-3 border-y border-border bg-background/60 text-center">
              <Compass className="h-8 w-8 text-primary" aria-hidden="true" />
              <EditableHint>Link do panorama 360° a cadastrar no painel</EditableHint>
            </div>
          )}
        </div>
      </Reveal>
      <div className="h-14" />
    </section>
  );
}

