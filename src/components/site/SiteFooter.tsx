import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, MapPin } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";

export function SiteFooter() {
  const { data: settings } = useSiteSettings();
  const brand = settings?.brand;
  const contact = settings?.contact;
  const location = settings?.location;
  const wa = whatsappLink(contact?.whatsapp, generalMessage());

  return (
    <footer className="border-t border-border/60 bg-surface/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-3xl tracking-[0.12em]">
            Gīreh <span className="text-primary/90">Barber</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {brand?.tagline || "Barbearia em Rio das Ostras — RJ"}
          </p>
          <div className="mt-6 flex gap-3">
            {contact?.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram da Gireh Barber"
                className="rounded-full border border-border p-2.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp da Gireh Barber"
                className="rounded-full border border-border p-2.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Links do rodapé">
          <p className="eyebrow">Navegue</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">Início</Link>
            </li>
            <li>
              <Link to="/" hash="servicos" className="hover:text-primary">Serviços</Link>
            </li>
            <li>
              <Link to="/" hash="galeria" className="hover:text-primary">Galeria</Link>
            </li>
            <li>
              <Link to="/" hash="localizacao" className="hover:text-primary">Localização</Link>
            </li>
            {contact?.instagram && (
              <li>
                <a href={contact.instagram} target="_blank" rel="noreferrer" className="hover:text-primary">
                  Instagram
                </a>
              </li>
            )}
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noreferrer" className="hover:text-primary">
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Contato</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {location?.address && (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  {location.address}
                  <br />
                  {location.city} — {location.state}
                  {location.zip ? `, ${location.zip}` : ""}
                </span>
              </li>
            )}
            {contact?.phone && (
              <li className="flex gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{contact.phone}</span>
              </li>
            )}
            {contact?.instagram && (
              <li className="flex gap-2">
                <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>@girehbarber</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {brand?.name || "Gireh Barber Shop"} — Rio das Ostras, RJ.
      </div>
    </footer>
  );
}
