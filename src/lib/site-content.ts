import { siteSettings } from "@/data/site-settings";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { mediaItems } from "@/data/media";
import { plans } from "@/data/plans";

/**
 * Conteúdo do site: antes vinha do Supabase (lido/editado pelo painel
 * administrativo), agora é estático — os dados moram em `src/data/` e só
 * mudam por edição de código. Os hooks abaixo preservam a mesma forma de
 * uso de antes (`const { data } = useX()`) para não exigir mudanças nos
 * componentes que os consomem; por baixo, são só os arrays estáticos.
 */

export type Brand = {
  name: string;
  tagline: string;
  logo_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_media_url: string;
  about_title: string;
  about_text: string;
};

export type Contact = {
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  booking_url: string;
};

export type LocationInfo = {
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: string;
  longitude: string;
  map_embed_url: string;
  directions_url: string;
  panorama_360_url: string;
};

export type HourItem = { day: string; hours: string };
export type Hours = { items: HourItem[]; note: string };

export type ExperienceItem = { icon: string; title: string; text: string };
export type Experience = { title: string; subtitle: string; items: ExperienceItem[] };

export type FaqItem = { question: string; answer: string };
export type Faq = { items: FaqItem[] };

export type NotificationSettings = {
  enabled: boolean;
  channels: string[];
  renewal_days_before: number;
  expiry_days_after: number;
  renewal_message: string;
  expiry_message: string;
};

export type PaymentSettings = { provider: string; enabled: boolean; instructions: string };

export type SiteSettings = {
  brand: Brand;
  contact: Contact;
  location: LocationInfo;
  hours: Hours;
  experience: Experience;
  faq: Faq;
  notifications: NotificationSettings;
  payments: PaymentSettings;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  duration_minutes: number | null;
  price_cents: number | null;
  price_label: string;
  image_url: string;
  whatsapp_override: string;
  highlight: boolean;
  highlight_label: string;
  sort_order: number;
  is_active: boolean;
};

export type Barber = {
  id: string;
  slug: string;
  name: string;
  role_title: string;
  bio: string;
  specialties: string[];
  photo_url: string;
  whatsapp: string;
  instagram: string;
  sort_order: number;
  is_active: boolean;
};

export type MediaItem = {
  id: string;
  collection: string;
  barber_id: string | null;
  media_type: string;
  url: string;
  thumbnail_url: string;
  title: string;
  caption: string;
  sort_order: number;
  is_active: boolean;
};

export type Plan = {
  id: string;
  name: string;
  summary: string;
  price_cents: number | null;
  price_label: string;
  billing_period: string;
  credits: number | null;
  benefits: string[];
  included_services: string[];
  rules: string;
  highlight: boolean;
  sort_order: number;
  is_active: boolean;
};

// Assinaturas de clientes continuam vindo do Supabase (tabela `subscriptions`,
// lida diretamente em /minha-conta) — não fazem parte do conteúdo do site.
export type Subscription = {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  plan_id: string | null;
  status: string;
  started_at: string | null;
  expires_at: string | null;
  credits_total: number | null;
  credits_used: number;
  notes: string;
  created_at: string;
};

export function useSiteSettings() {
  return { data: siteSettings, isLoading: false as const, error: null as null };
}

export function useServices(onlyActive = true) {
  const data = onlyActive ? services.filter((item) => item.is_active) : services;
  return { data, isLoading: false as const, error: null as null };
}

export function useBarbers(onlyActive = true) {
  const data = onlyActive ? barbers.filter((item) => item.is_active) : barbers;
  return { data, isLoading: false as const, error: null as null };
}

export function useMedia(collection?: string) {
  const data = collection
    ? mediaItems.filter((item) => item.collection === collection)
    : mediaItems;
  return { data, isLoading: false as const, error: null as null };
}

export function usePlans(onlyActive = true) {
  const data = onlyActive ? plans.filter((item) => item.is_active) : plans;
  return { data, isLoading: false as const, error: null as null };
}
