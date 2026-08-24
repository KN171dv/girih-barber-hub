import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export const defaultSettings: SiteSettings = {
  brand: {
    name: "Girih Barbearia",
    tagline: "",
    logo_url: "",
    hero_title: "",
    hero_subtitle: "",
    hero_media_url: "",
    about_title: "",
    about_text: "",
  },
  contact: {
    whatsapp: "",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    booking_url: "",
  },
  location: {
    address: "",
    city: "Rio das Ostras",
    state: "RJ",
    zip: "",
    latitude: "",
    longitude: "",
    map_embed_url: "",
    directions_url: "",
    panorama_360_url: "",
  },
  hours: { items: [], note: "" },
  experience: { title: "A experiência Girih", subtitle: "", items: [] },
  faq: { items: [] },
  notifications: {
    enabled: false,
    channels: [],
    renewal_days_before: 0,
    expiry_days_after: 0,
    renewal_message: "",
    expiry_message: "",
  },
  payments: { provider: "", enabled: false, instructions: "" },
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

export type Payment = {
  id: string;
  subscription_id: string;
  amount_cents: number | null;
  status: string;
  method: string;
  due_date: string | null;
  paid_at: string | null;
  reference: string;
};

function mergeSettings(rows: { key: string; value: Record<string, unknown> }[]): SiteSettings {
  const merged = structuredClone(defaultSettings) as unknown as Record<string, unknown>;
  for (const row of rows) {
    const base = (merged[row.key] ?? {}) as Record<string, unknown>;
    merged[row.key] = { ...base, ...(row.value ?? {}) };
  }
  return merged as unknown as SiteSettings;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      return mergeSettings(
        (data ?? []) as unknown as { key: string; value: Record<string, unknown> }[],
      );
    },
    staleTime: 60_000,
  });
}

export function useServices(onlyActive = true) {
  return useQuery({
    queryKey: ["services", onlyActive],
    queryFn: async (): Promise<Service[]> => {
      let query = supabase.from("services").select("*").order("sort_order");
      if (onlyActive) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Service[];
    },
    staleTime: 60_000,
  });
}

export function useBarbers(onlyActive = true) {
  return useQuery({
    queryKey: ["barbers", onlyActive],
    queryFn: async (): Promise<Barber[]> => {
      let query = supabase.from("barbers").select("*").order("sort_order");
      if (onlyActive) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Barber[];
    },
    staleTime: 60_000,
  });
}

export function useMedia(collection?: string) {
  return useQuery({
    queryKey: ["media_items", collection ?? "all"],
    queryFn: async (): Promise<MediaItem[]> => {
      let query = supabase.from("media_items").select("*").order("sort_order");
      if (collection) query = query.eq("collection", collection);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as MediaItem[];
    },
    staleTime: 60_000,
  });
}

export function usePlans(onlyActive = true) {
  return useQuery({
    queryKey: ["plans", onlyActive],
    queryFn: async (): Promise<Plan[]> => {
      let query = supabase.from("plans").select("*").order("sort_order");
      if (onlyActive) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Plan[];
    },
    staleTime: 60_000,
  });
}
