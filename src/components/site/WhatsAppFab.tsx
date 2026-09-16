import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";
import { EASE_SMOOTH } from "@/lib/motion";

/**
 * CTA fixo de agendamento via WhatsApp. Aparece ao rolar a página e expande
 * um rótulo no hover — com a identidade dourada/grafite da marca em vez do
 * balão verde padrão do WhatsApp.
 */
export function WhatsAppFab() {
  const { data: settings } = useSiteSettings();
  const [visible, setVisible] = useState(false);
  const href = whatsappLink(settings?.contact.whatsapp, generalMessage());

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!href) return null;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Agendar horário pelo WhatsApp"
      initial={false}
      animate={visible ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE_SMOOTH }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center overflow-hidden rounded-full border border-primary/40 bg-gradient-gold text-primary-foreground shadow-gold"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center sm:h-14 sm:w-14">
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap pr-0 text-xs font-semibold uppercase tracking-[0.14em] transition-[max-width,padding-right] duration-300 ease-out group-hover:max-w-[180px] group-hover:pr-5">
        Agendar no WhatsApp
      </span>
    </motion.a>
  );
}
