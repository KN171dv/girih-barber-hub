import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

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
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-elegant transition-all duration-300 hover:scale-105 sm:h-14 sm:w-14",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
