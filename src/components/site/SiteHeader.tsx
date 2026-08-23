import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { hash: "", label: "Início" },
  { hash: "barbearia", label: "A Barbearia" },
  { hash: "servicos", label: "Serviços" },
  { hash: "galeria", label: "Galeria" },
  { hash: "espaco", label: "Nosso Espaço" },
  { hash: "contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: settings } = useSiteSettings();
  const { isAdmin } = useAuth();
  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());
  const brandName = settings?.brand.name || "Gireh Barber Shop";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/70 bg-background/90 backdrop-blur-xl"
          : "border-b border-transparent bg-background/20 backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 transition-all duration-500 lg:flex lg:justify-between",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          {settings?.brand.logo_url ? (
            <img
              src={settings.brand.logo_url}
              alt={brandName}
              className="h-9 w-auto object-contain"
            />
          ) : null}
          <span className="truncate font-display text-2xl leading-none tracking-[0.12em] sm:text-3xl">
            Gīreh <span className="text-primary/90">Barber</span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to="/"
              {...(item.hash ? { hash: item.hash } : {})}
              className="relative text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAdmin && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin">Painel</Link>
            </Button>
          )}
          {wa && (
            <Button asChild variant="gold" size="sm">
              <a href={wa} target="_blank" rel="noreferrer">
                Agendar horário
              </a>
            </Button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/70 text-foreground lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/98 backdrop-blur-xl lg:hidden">
          <nav aria-label="Navegação móvel" className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to="/"
                {...(item.hash ? { hash: item.hash } : {})}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 px-1 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="px-1 py-4 text-sm uppercase tracking-[0.16em] text-muted-foreground"
              >
                Painel administrativo
              </Link>
            )}
            {wa && (
              <Button asChild variant="gold" className="my-4">
                <a href={wa} target="_blank" rel="noreferrer">
                  Agendar pelo WhatsApp
                </a>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
