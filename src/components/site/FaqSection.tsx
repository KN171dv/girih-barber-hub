import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./SectionHeading";
import { EditableHint } from "./EditableHint";
import { useSiteSettings } from "@/lib/site-content";

export function FaqSection() {
  const { data: settings } = useSiteSettings();
  const items = settings?.faq.items ?? [];

  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <SectionHeading
        eyebrow="Dúvidas"
        title="Perguntas frequentes"
        description="Agendamento, planos e atendimento — respostas editáveis no painel administrativo."
        align="center"
      />
      <div className="mt-10">
        {items.length === 0 ? (
          <EditableHint>Perguntas frequentes a cadastrar no painel</EditableHint>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={`${item.question}-${index}`} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}
