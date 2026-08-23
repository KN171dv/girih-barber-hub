import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableHint } from "./EditableHint";
import { formatPrice } from "@/lib/format";
import type { Plan } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function PlanCard({
  plan,
  onChoose,
}: {
  plan: Plan;
  onChoose?: (plan: Plan) => void;
}) {
  const price = formatPrice(plan.price_cents, plan.price_label);

  return (
    <article
      className={cn(
        "surface-card flex flex-col gap-5 p-7",
        plan.highlight && "border-primary/60 shadow-gold",
      )}
    >
      {plan.highlight && <p className="eyebrow">Mais escolhido</p>}
      <div>
        <h3 className="text-3xl">{plan.name || <EditableHint>Nome do plano</EditableHint>}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {plan.summary || <EditableHint>Resumo a cadastrar</EditableHint>}
        </p>
      </div>
      <div className="flex items-end gap-2">
        <span className="font-display text-5xl text-primary">{price ?? "—"}</span>
        <span className="pb-2 text-sm text-muted-foreground">/{plan.billing_period}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        {plan.credits !== null && plan.credits !== undefined ? (
          <p>
            <strong className="text-foreground">{plan.credits}</strong> créditos/atendimentos
            inclusos
          </p>
        ) : (
          <EditableHint>Créditos inclusos a definir</EditableHint>
        )}
      </div>
      <ul className="space-y-2 text-sm">
        {plan.benefits.length === 0 && plan.included_services.length === 0 && (
          <li>
            <EditableHint>Benefícios e serviços inclusos a cadastrar</EditableHint>
          </li>
        )}
        {[...plan.included_services, ...plan.benefits].map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
      {plan.rules && (
        <p className="rounded-md border border-border/70 bg-background/40 p-3 text-xs text-muted-foreground">
          {plan.rules}
        </p>
      )}
      <Button
        variant={plan.highlight ? "gold" : "outlineGold"}
        className="mt-auto w-full"
        onClick={() => onChoose?.(plan)}
      >
        Escolher este plano
      </Button>
    </article>
  );
}
