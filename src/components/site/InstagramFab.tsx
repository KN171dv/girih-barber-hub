import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";
import { EASE_SMOOTH } from "@/lib/motion";
import { subscribeHeaderVisible, getHeaderVisible } from "@/lib/headerVisibility";

/**
 * Atalho discreto pro Instagram, sempre alcançável durante o scroll — sem
 * precisar chegar até a seção dedicada no final da página. Fica empilhado
 * logo acima do WhatsAppFab, bem menor e sem o destaque dourado (o
 * WhatsApp continua sendo a ação principal). Aparece/some junto com ele
 * (mesmo gatilho de scroll) e também respeita a Fase 1 do vídeo de
 * introdução — mesmo sinal que esconde o header nesse trecho.
 */
export function InstagramFab() {
  const { data: settings } = useSiteSettings();
  const [scrolledPast, setScrolledPast] = useState(false);
  const headerVisible = useSyncExternalStore(subscribeHeaderVisible, getHeaderVisible, () => true);
  const href = settings?.contact.instagram;

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!href) return null;

  const visible = scrolledPast && headerVisible;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Seguir no Instagram"
      initial={false}
      animate={visible ? { y: 0, opacity: 1 } : { y: 12, opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE_SMOOTH }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-[calc(max(1rem,env(safe-area-inset-bottom))+3.75rem)] right-4 z-40 grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-primary/50 hover:text-primary sm:bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)]"
    >
      <Instagram className="h-4 w-4" aria-hidden="true" />
    </motion.a>
  );
}
