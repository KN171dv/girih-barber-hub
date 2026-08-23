import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";
import { whatsappLink, generalMessage } from "@/lib/whatsapp";

export function WhatsAppFab() {
  const { data: settings } = useSiteSettings();
  const href = whatsappLink(settings?.contact.whatsapp, generalMessage());
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-elegant transition-transform hover:scale-105 sm:h-16 sm:w-16"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
