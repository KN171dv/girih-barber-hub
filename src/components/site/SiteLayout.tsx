import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFab } from "./WhatsAppFab";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { cn } from "@/lib/utils";

export function SiteLayout({
  children,
  flush = false,
  initialHeaderHidden = false,
}: {
  children: ReactNode;
  /** Quando verdadeiro, o conteúdo passa por baixo do cabeçalho fixo (usado no hero). */
  flush?: boolean;
  /**
   * Quando verdadeiro, o header já nasce escondido — no HTML renderizado
   * pelo servidor, não só depois de hidratar — pra páginas com uma seção de
   * introdução que controla a visibilidade dele (ver ScrollVideoIntro). Sem
   * isso, o header apareceria por uma fração de segundo antes do JavaScript
   * rodar e escondê-lo.
   */
  initialHeaderHidden?: boolean;
}) {
  return (
    <SmoothScrollProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader initialHidden={initialHeaderHidden} />
        <main className={cn("flex-1", !flush && "pt-20")}>{children}</main>
        <SiteFooter />
        <WhatsAppFab />
      </div>
    </SmoothScrollProvider>
  );
}
