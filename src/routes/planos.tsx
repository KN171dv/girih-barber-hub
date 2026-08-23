import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PlanCard } from "@/components/site/PlanCard";
import { EditableHint } from "@/components/site/EditableHint";
import { FaqSection } from "@/components/site/FaqSection";
import { usePlans, useSiteSettings, type Plan } from "@/lib/site-content";
import { planMessage, whatsappLink } from "@/lib/whatsapp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e assinaturas — Girih Barbearia" },
      {
        name: "description",
        content:
          "Compare os planos de assinatura da Girih Barbearia em Rio das Ostras: benefícios, créditos incluídos, regras e valor mensal.",
      },
      { property: "og:title", content: "Planos e assinaturas — Girih Barbearia" },
      {
        property: "og:description",
        content: "Benefícios, créditos e regras dos planos mensais da Girih Barbearia.",
      },
    ],
  }),
  component: PlansPage,
});

function PlansPage() {
  const { data: plans = [] } = usePlans();
  const { data: settings } = useSiteSettings();
  const [chosen, setChosen] = useState<Plan | null>(null);

  const payments = settings?.payments;
  const wa = whatsappLink(settings?.contact.whatsapp, planMessage(chosen?.name));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Assinaturas"
          title="Planos mensais"
          description="Compare os planos, veja benefícios, créditos inclusos e regras. Tudo editável no painel administrativo."
          align="center"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onChoose={setChosen} />
          ))}
          {plans.length === 0 && (
            <EditableHint>Planos a cadastrar no painel administrativo</EditableHint>
          )}
        </div>

        <div className="mt-12 surface-card p-7">
          <p className="eyebrow">Pagamento</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {payments?.enabled && payments.instructions ? (
              payments.instructions
            ) : (
              <EditableHint>
                Pagamento online ainda não configurado — a contratação é confirmada pela equipe.
              </EditableHint>
            )}
          </p>
        </div>
      </section>

      <FaqSection />

      <Dialog open={Boolean(chosen)} onOpenChange={(open) => !open && setChosen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl">Plano {chosen?.name}</DialogTitle>
            <DialogDescription>
              Confirme a contratação com a equipe. O pagamento online será habilitado em breve.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[...(chosen?.included_services ?? []), ...(chosen?.benefits ?? [])].map(
              (item, index) => (
                <li key={`${item}-${index}`} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ),
            )}
          </ul>
          {wa ? (
            <Button asChild variant="whatsapp" size="lg">
              <a href={wa} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" /> Falar com a barbearia
              </a>
            </Button>
          ) : (
            <EditableHint>Cadastre o WhatsApp no painel para ativar a contratação</EditableHint>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
