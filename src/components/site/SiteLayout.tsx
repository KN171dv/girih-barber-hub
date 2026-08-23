import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFab } from "./WhatsAppFab";
import { cn } from "@/lib/utils";

export function SiteLayout({
  children,
  flush = false,
}: {
  children: ReactNode;
  /** Quando verdadeiro, o conteúdo passa por baixo do cabeçalho fixo (usado no hero). */
  flush?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className={cn("flex-1", !flush && "pt-20")}>{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
