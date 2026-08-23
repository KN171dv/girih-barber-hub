import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";
import { EditableHint } from "./EditableHint";

export function SiteFooter() {
  const { data: settings } = useSiteSettings();
  const brand = settings?.brand;
  const contact = settings?.contact;
  const location = settings?.location;
  const hours = settings?.hours.items ?? [];

  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-3xl">{brand?.name || "Girih Barbearia"}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {brand?.tagline || <EditableHint>Slogan editável no painel</EditableHint>}
          </p>
          <div className="mt-5 flex gap-3">
            {contact?.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {contact?.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Links do rodapé">
          <p className="eyebrow">Navegue</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/servicos" className="hover:text-primary">Serviços</Link></li>
            <li><Link to="/barbeiros" className="hover:text-primary">Nossos barbeiros</Link></li>
            <li><Link to="/planos" className="hover:text-primary">Planos e assinaturas</Link></li>
            <li><Link to="/localizacao" className="hover:text-primary">Localização</Link></li>
            <li><Link to="/minha-conta" className="hover:text-primary">Área do cliente</Link></li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Contato</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{contact?.phone || <EditableHint>Telefone a cadastrar</EditableHint>}</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{contact?.email || <EditableHint>E-mail a cadastrar</EditableHint>}</span>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                {location?.address ? (
                  `${location.address} — ${location.city}/${location.state}`
                ) : (
                  <EditableHint>Endereço a cadastrar — Rio das Ostras/RJ</EditableHint>
                )}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Horários</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {hours.length === 0 && (
              <li className="flex gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <EditableHint>Horários a cadastrar no painel</EditableHint>
              </li>
            )}
            {hours.map((item, index) => (
              <li key={`${item.day}-${index}`} className="flex justify-between gap-4">
                <span>{item.day}</span>
                <span className="text-foreground">{item.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {brand?.name || "Girih Barbearia"} — Rio das Ostras, RJ.
      </div>
    </footer>
  );
}
