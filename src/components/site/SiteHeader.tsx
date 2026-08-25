import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "./BrandLogo";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { hash: "", label: "Início" },
  { hash: "barbearia", label: "Barbearia" },
  { hash: "servicos", label: "Serviços" },
  { hash: "barbeiros", label: "Barbeiros" },
  { hash: "galeria", label: "Galeria" },
  { hash: "localizacao", label: "Localização" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: settings } = useSiteSettings();
  const { isAdmin } = useAuth();
  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-background/70 to-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 transition-all duration-300 lg:flex lg:justify-between lg:gap-8",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link
          to="/"
          aria-label="Gireh Barber Shop — início"
          className="flex min-w-0 items-center"
          onClick={() => setOpen(false)}
        >
          <BrandLogo
            imgClassName={cn(
              "transition-all duration-300",
              scrolled ? "max-h-9" : "max-h-11 sm:max-h-12",
            )}
            textClassName={cn(
              "transition-all duration-300",
              scrolled ? "text-2xl" : "text-2xl sm:text-3xl",
            )}
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to="/"
              {...(item.hash ? { hash: item.hash } : {})}
              className="relative py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100"
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
            <Button asChild variant="gold" size="sm" className="tracking-[0.16em]">
              <a href={wa} target="_blank" rel="noreferrer">
                AGENDAR HORÁRIO
              </a>
            </Button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/70 text-foreground transition-colors hover:border-primary hover:text-primary lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/98 backdrop-blur-xl lg:hidden">
          <nav aria-label="Navegação móvel" className="mx-auto flex max-w-6xl flex-col px-4 py-2">
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
              <Button asChild variant="gold" className="my-4 h-12 tracking-[0.16em]">
                <a href={wa} target="_blank" rel="noreferrer">
                  AGENDAR HORÁRIO
                </a>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
