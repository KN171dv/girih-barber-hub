import { Quote, Star } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";

/**
 * ⚠️ CONTEÚDO DE EXEMPLO — SUBSTITUIR ANTES DE PUBICAR "PRA VALER"
 *
 * Estes 3 depoimentos são placeholders (nomes e textos fictícios) só pra
 * mostrar como a seção fica montada. Troque pelos depoimentos reais de
 * clientes assim que tiver — cada item também carrega `isPlaceholder: true`,
 * que faz aparecer o selo "EXEMPLO" no card; remova esse campo (ou apague o
 * item) quando o depoimento for real.
 */
type Testimonial = {
  name: string;
  context: string;
  quote: string;
  rating: number;
  isPlaceholder?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rafael M.",
    context: "Cliente há 1 ano",
    quote:
      "Ambiente excelente e atenção aos detalhes. Saio sempre satisfeito com o resultado e o atendimento é muito atencioso.",
    rating: 5,
    isPlaceholder: true,
  },
  {
    name: "Bruno T.",
    context: "Cliente fiel",
    quote:
      "Profissionais muito bons, sempre pontuais e o corte fica exatamente como eu peço. Recomendo a barbearia.",
    rating: 5,
    isPlaceholder: true,
  },
  {
    name: "Diego A.",
    context: "Novo cliente",
    quote:
      "Primeira vez que fui e já virei cliente fixo. Ambiente agradável, café bom e um corte impecável.",
    rating: 5,
    isPlaceholder: true,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Depoimentos de clientes — cards com nome, contexto e avaliação.
 * Ver aviso no topo do arquivo: o conteúdo atual é placeholder.
 */
export function TestimonialsSection({ index }: { index?: string }) {
  return (
    <section className="border-y border-border/60 bg-surface/20 section-y">
      <div className="mx-auto max-w-6xl px-4">
        <SectionLabel
          {...(index ? { index } : {})}
          eyebrow="Depoimentos"
          title="O QUE NOSSOS CLIENTES DIZEM"
          description="Avaliações de quem já passou pela cadeira da Gireh."
        />

        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          {TESTIMONIALS.map((item, index) => (
            <Reveal key={item.name} delay={index * 80}>
              <article className="surface-card relative flex h-full flex-col gap-4 p-6">
                {item.isPlaceholder && (
                  <span className="absolute right-4 top-4 rounded-full border border-primary/40 bg-background/80 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
                    Exemplo
                  </span>
                )}
                <Quote className="h-6 w-6 text-primary/60" aria-hidden="true" />
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  "{item.quote}"
                </p>
                <div
                  className="flex items-center gap-1"
                  aria-label={`${item.rating} de 5 estrelas`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < item.rating
                          ? "h-3.5 w-3.5 fill-primary text-primary"
                          : "h-3.5 w-3.5 text-border"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-sm text-primary"
                    aria-hidden="true"
                  >
                    {initials(item.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.context}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
