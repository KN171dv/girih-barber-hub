import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/barbeiros", label: "Barbeiros" },
  { to: "/planos", label: "Planos" },
  { to: "/localizacao", label: "Onde estamos" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const { user, isAdmin } = useAuth();
  const wa = whatsappLink(settings?.contact.whatsapp, generalMessage());
  const brandName = settings?.brand.name || "Girih Barbearia";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {settings?.brand.logo_url ? (
            <img
              src={settings.brand.logo_url}
              alt={brandName}
              className="h-10 w-auto object-contain"
              width={120}
              height={40}
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 text-primary">
              <Scissors className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          <span className="font-display text-2xl leading-none tracking-wide sm:text-3xl">
            {brandName}
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to={user ? "/minha-conta" : "/entrar"}>
              {user ? "Minha conta" : "Entrar"}
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="outline" size="sm">
              <Link to="/admin">Painel</Link>
            </Button>
          )}
          <Button asChild variant="gold" size="sm" disabled={!wa}>
            <a href={wa ?? "#"} target="_blank" rel="noreferrer">
              Agendar agora
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav aria-label="Navegação móvel" className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={user ? "/minha-conta" : "/entrar"}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-base font-medium text-muted-foreground hover:text-primary"
            >
              {user ? "Minha conta" : "Entrar"}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-base font-medium text-muted-foreground hover:text-primary"
              >
                Painel administrativo
              </Link>
            )}
            <Button asChild variant="gold" className="mt-3" disabled={!wa}>
              <a href={wa ?? "#"} target="_blank" rel="noreferrer">
                Agendar agora
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
