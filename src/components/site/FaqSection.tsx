import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteSettings } from "@/lib/site-content";

export function FaqSection() {
  const { data: settings } = useSiteSettings();
  const items = settings?.faq.items ?? [];

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-24">
      <div className="text-center">
        <span className="eyebrow">Dúvidas</span>
        <h2 className="mt-3 text-4xl uppercase leading-[1.05] sm:text-5xl">Dúvidas frequentes</h2>
      </div>
      <Accordion type="single" collapsible className="mt-10 w-full">
        {items.map((item, index) => (
          <AccordionItem
            key={`${item.question}-${index}`}
            value={`faq-${index}`}
            className="border-border/60"
          >
            <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline data-[state=open]:text-primary">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
