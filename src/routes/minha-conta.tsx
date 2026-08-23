import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { EditableHint } from "@/components/site/EditableHint";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePlans, type Subscription } from "@/lib/site-content";
import { daysUntil, formatDate } from "@/lib/format";

export const Route = createFileRoute("/minha-conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Girih Barbearia" },
      {
        name: "description",
        content:
          "Área do cliente da Girih Barbearia: acompanhe status da assinatura, benefícios, créditos e validade.",
      },
      { property: "og:title", content: "Minha conta — Girih Barbearia" },
      { property: "og:description", content: "Status, benefícios e validade da sua assinatura." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { data: plans = [] } = usePlans(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/entrar" });
  }, [loading, user, navigate]);

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["my_subscriptions", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<Subscription[]> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Subscription[];
    },
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Área do cliente</p>
            <h1 className="mt-2 text-4xl">Minha conta</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut aria-hidden="true" /> Sair
          </Button>
        </div>

        <div className="mt-10 space-y-6">
          {subscriptions.length === 0 && (
            <div className="surface-card p-8 text-center">
              <p className="text-muted-foreground">
                Você ainda não possui assinatura vinculada a esta conta.
              </p>
              <Button asChild variant="gold" className="mt-5">
                <Link to="/planos">Ver planos disponíveis</Link>
              </Button>
            </div>
          )}

          {subscriptions.map((subscription) => {
            const plan = plans.find((item) => item.id === subscription.plan_id);
            const remaining = daysUntil(subscription.expires_at);
            const credits =
              subscription.credits_total !== null
                ? `${subscription.credits_used}/${subscription.credits_total}`
                : `${subscription.credits_used}`;

            return (
              <article key={subscription.id} className="surface-card space-y-4 p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-3xl">
                    {plan?.name || <EditableHint>Plano a vincular</EditableHint>}
                  </h2>
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-wider text-primary">
                    {subscription.status}
                  </span>
                </div>
                <dl className="grid gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">Início</dt>
                    <dd className="text-foreground">{formatDate(subscription.started_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Validade</dt>
                    <dd className="text-foreground">
                      {formatDate(subscription.expires_at)}
                      {remaining !== null && remaining >= 0 && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({remaining} dias)
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Créditos usados</dt>
                    <dd className="text-foreground">{credits}</dd>
                  </div>
                </dl>
                {plan && (plan.benefits.length > 0 || plan.included_services.length > 0) && (
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {[...plan.included_services, ...plan.benefits].map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
