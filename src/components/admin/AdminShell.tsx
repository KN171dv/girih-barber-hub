import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  Settings,
  Users,
  Wallet,
  Image as ImageIcon,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getAdminProfile } from "@/lib/admin-auth.functions";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/servicos", label: "Serviços", icon: Scissors },
  { to: "/admin/equipe", label: "Equipe", icon: UserCog },
  { to: "/admin/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/admin/conteudo", label: "Conteúdo do site", icon: ImageIcon },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function useAdminProfile() {
  const { user, isAdmin } = useAuth();
  return useQuery({
    queryKey: ["admin_profile", user?.id],
    enabled: Boolean(user && isAdmin),
    queryFn: () => getAdminProfile({ data: undefined as never }),
    staleTime: 300_000,
  });
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === "/admin" || pathname === "/admin/"
          : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-primary/12 text-primary font-medium ring-1 ring-primary/25"
                : "text-muted-foreground hover:bg-surface-2/70 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: profile } = useAdminProfile();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/admin/login", replace: true });
  }, [loading, user, isAdmin, navigate]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const adminName = profile?.display_name || "ADM";

  const brand = (
    <div className="flex items-center gap-3 px-3 py-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/40 font-display text-lg text-primary">
        G
      </span>
      <div className="leading-tight">
        <p className="font-display text-lg tracking-wide text-foreground">GIREH</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Painel de gestão
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface/60 px-3 lg:flex">
        {brand}
        <div className="mt-2 flex-1 overflow-y-auto">
          <NavList />
        </div>
        <div className="border-t border-border/70 py-4">
          <p className="px-3 text-xs text-muted-foreground">Conectado como</p>
          <p className="px-3 text-sm text-foreground">{adminName}</p>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu">
                  <Menu className="h-4 w-4" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-surface p-0">
                <SheetTitle className="sr-only">Menu do painel</SheetTitle>
                <div className="flex h-full flex-col px-3">
                  {brand}
                  <div className="flex-1 overflow-y-auto">
                    <NavList onNavigate={() => setMenuOpen(false)} />
                  </div>
                  <Button
                    variant="ghost"
                    className="my-4 justify-start text-muted-foreground"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-2xl tracking-wide sm:text-3xl">{title}</h1>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/30 px-6 py-14 text-center">
      <p className="text-sm text-foreground">{title}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: typeof Users;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-primary/70" aria-hidden="true" />}
      </div>
      <p className="mt-3 font-display text-3xl text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
