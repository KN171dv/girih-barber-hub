import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EditableHint } from "./EditableHint";
import type { Barber } from "@/lib/site-content";
import placeholder from "@/assets/placeholder-barber.jpg";

export function BarberCard({ barber }: { barber: Barber }) {
  return (
    <article className="surface-card overflow-hidden">
      <div className="relative">
        <img
          src={barber.photo_url || placeholder}
          alt={barber.name || "Barbeiro da Girih Barbearia"}
          loading="lazy"
          width={900}
          height={1200}
          className="h-72 w-full object-cover"
        />
        {!barber.photo_url && (
          <span className="absolute inset-x-0 bottom-0 bg-background/70 p-2 text-center text-xs text-muted-foreground">
            Foto a enviar
          </span>
        )}
      </div>
      <div className="space-y-3 p-6">
        <div>
          <h3 className="text-2xl">
            {barber.name || <EditableHint>Nome a cadastrar</EditableHint>}
          </h3>
          <p className="text-sm text-primary">{barber.role_title || "Barbeiro"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {barber.specialties.length === 0 ? (
            <EditableHint>Especialidades a cadastrar</EditableHint>
          ) : (
            barber.specialties.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))
          )}
        </div>
        <Button asChild variant="outlineGold" className="w-full">
          <Link to="/barbeiros/$slug" params={{ slug: barber.slug }}>
            Ver perfil e portfólio
          </Link>
        </Button>
      </div>
    </article>
  );
}
