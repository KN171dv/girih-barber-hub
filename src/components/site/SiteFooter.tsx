import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, MapPin } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";

const NAV = [
  { hash: "", label: "Início" },
  { hash: "barbearia", label: "Barbearia" },
  { hash: "servicos", label: "Serviços" },
  { hash: "barbeiros", label: "Barbeiros" },
  { hash: "galeria", label: "Galeria" },
  { hash: "localizacao", label: "Localização" },
] as const;

export function SiteFooter() {
  const { data: settings } = useSiteSettings();
  const brand = settings?.brand;
  const contact = settings?.contact;
  const location = settings?.location;
  const wa = whatsappLink(contact?.whatsapp, generalMessage());

  return (
    <footer className="border-t border-border/60 bg-surface/25">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-center sm:grid-cols-2 sm:gap-10 sm:py-16 sm:text-left lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex min-w-0 flex-col items-center sm:items-start">
          <BrandLogo imgClassName="max-h-12" textClassName="text-3xl" loading="lazy" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {brand?.tagline || "Barbearia em Rio das Ostras — RJ"}
          </p>
          <div className="mt-5 flex justify-center gap-3 sm:mt-6 sm:justify-start">
            {contact?.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram da Gireh Barber Shop"
                className="rounded-full border border-border p-2.5 text-muted-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp da Gireh Barber Shop"
                className="rounded-full border border-border p-2.5 text-muted-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Links do rodapé" className="min-w-0">
          <p className="eyebrow">Navegação</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to="/"
                  {...(item.hash ? { hash: item.hash } : {})}
                  className="transition-colors duration-200 hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <p className="eyebrow">Contato</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {wa && (
              <li>
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 transition-colors duration-200 hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  WhatsApp
                </a>
              </li>
            )}
            {contact?.instagram && (
              <li>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 transition-colors duration-200 hover:text-primary"
                >
                  <Instagram className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Instagram
                </a>
              </li>
            )}
            {location?.address && (
              <li className="flex justify-center gap-2 sm:justify-start">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {location.address}
                  {location.city ? ` — ${location.city}/${location.state}` : ""}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/50">
        <p className="mx-auto max-w-6xl px-4 py-6 text-center text-xs tracking-[0.12em] text-muted-foreground">
          © 2026 Gireh Barber Shop. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
