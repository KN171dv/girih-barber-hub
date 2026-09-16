import { Camera, ImagePlus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Barber, MediaItem } from "@/lib/site-content";

/**
 * Galeria exclusiva de um barbeiro. O portfólio vem de `media_items`
 * filtrado por `barber_id`, então cada profissional mantém as próprias fotos.
 */
export function BarberPortfolioDialog({
  barber,
  works,
  open,
  onOpenChange,
  bookingHref,
}: {
  barber: Barber;
  works: MediaItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingHref: string | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl">{barber.name}</DialogTitle>
          <DialogDescription>Barbeiro · Portfólio de trabalhos</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[minmax(0,220px)_1fr]">
          <div className="overflow-hidden rounded-xl border border-border bg-surface/50">
            {barber.photo_url ? (
              <img
                src={barber.photo_url}
                alt={`Foto de ${barber.name}`}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <Camera className="h-6 w-6" aria-hidden="true" />
                <span className="px-4 text-xs">Foto de perfil a enviar</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{barber.bio}</p>

            {works.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-10 text-center">
                <ImagePlus className="h-7 w-7 text-primary" aria-hidden="true" />
                <p className="text-sm text-foreground">Portfólio em preparação</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Novos trabalhos de {barber.name} podem ser adicionados a qualquer momento em
                  src/data/media.ts.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {works.map((work) => (
                  <figure
                    key={work.id}
                    className="overflow-hidden rounded-lg border border-border/70"
                  >
                    <img
                      src={work.thumbnail_url || work.url}
                      alt={work.title || `Trabalho de ${barber.name}`}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </figure>
                ))}
              </div>
            )}

            {bookingHref ? (
              <Button asChild variant="gold" className="w-full">
                <a href={bookingHref} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" /> Agendar com {barber.name}
                </a>
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                WhatsApp de {barber.name} a definir no código
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
