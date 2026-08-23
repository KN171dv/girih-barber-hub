import { Compass, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableHint } from "./EditableHint";
import { useSiteSettings } from "@/lib/site-content";

/** Seção "Conheça nosso espaço" com panorama 360° do Google Maps. */
export function VirtualTour() {
  const { data: settings } = useSiteSettings();
  const location = settings?.location;
  const panorama = location?.panorama_360_url;

  return (
    <section className="relative overflow-hidden border-y border-primary/20 bg-surface/40 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
          <div>
            <p className="eyebrow">Visita virtual</p>
            <h2 className="mt-3 text-4xl leading-[1.05] sm:text-5xl">
              Conheça nosso <span className="text-gradient-gold">espaço</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Dê uma volta pela Girih Barbearia sem sair de casa: arraste para girar o panorama
              360° e veja o ambiente climatizado, o lounge de espera e as cadeiras de atendimento
              antes da sua visita.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outlineGold" disabled={!panorama}>
                <a href={panorama || "#"} target="_blank" rel="noreferrer">
                  <Maximize2 aria-hidden="true" /> Abrir em tela cheia
                </a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border shadow-elegant">
            {panorama ? (
              <iframe
                src={panorama}
                title="Panorama 360° da Girih Barbearia"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[420px] w-full"
              />
            ) : (
              <div className="flex h-[320px] flex-col items-center justify-center gap-3 bg-background/60 text-center">
                <Compass className="h-8 w-8 text-primary" aria-hidden="true" />
                <EditableHint>Link do panorama 360° a cadastrar no painel</EditableHint>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
