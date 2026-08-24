import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type AppointmentStatus =
  | "pendente"
  | "confirmado"
  | "concluido"
  | "cancelado"
  | "nao_compareceu";

export type AppointmentSource = "site" | "whatsapp" | "manual";

export type Appointment = {
  id: string;
  client_id: string | null;
  customer_name: string;
  customer_phone: string;
  service_id: string | null;
  barber_id: string | null;
  scheduled_date: string;
  start_time: string;
  duration_minutes: number;
  price_cents: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  notes: string;
  created_at: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  status: string;
  created_at: string;
};

export type BusinessDay = {
  day: string;
  open: boolean;
  start: string;
  end: string;
  break_start: string;
  break_end: string;
};

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
  nao_compareceu: "Não compareceu",
};

export const STATUS_CLASS: Record<AppointmentStatus, string> = {
  pendente: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  confirmado: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  concluido: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  cancelado: "border-red-500/40 bg-red-500/10 text-red-300",
  nao_compareceu: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
};

export const SOURCE_LABEL: Record<AppointmentSource, string> = {
  site: "Site",
  whatsapp: "WhatsApp",
  manual: "Manual",
};

export const STATUS_ORDER: AppointmentStatus[] = [
  "pendente",
  "confirmado",
  "concluido",
  "cancelado",
  "nao_compareceu",
];

export function toISODate(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDays(iso: string, amount: number) {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function startOfWeek(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  const diff = date.getDay();
  date.setDate(date.getDate() - diff);
  return toISODate(date);
}

export function formatLongDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  return date
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    .replace(".", "")
    .toUpperCase();
}

export function weekdayName(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("pt-BR", { weekday: "long" }).toUpperCase();
}

export function shortTime(value: string) {
  return (value ?? "").slice(0, 5);
}

export function endTime(start: string, minutes: number) {
  const [h = 0, m = 0] = shortTime(start).split(":").map(Number);
  const total = h * 60 + m + (minutes || 0);
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function overlaps(aStart: string, aMin: number, bStart: string, bMin: number) {
  const toMin = (v: string) => {
    const [h = 0, m = 0] = shortTime(v).split(":").map(Number);
    return h * 60 + m;
  };
  const a1 = toMin(aStart);
  const a2 = a1 + Math.max(aMin, 1);
  const b1 = toMin(bStart);
  const b2 = b1 + Math.max(bMin, 1);
  return a1 < b2 && b1 < a2;
}

export function useAppointments(range?: { from: string; to: string }) {
  return useQuery({
    queryKey: ["appointments", range?.from ?? "all", range?.to ?? "all"],
    queryFn: async (): Promise<Appointment[]> => {
      let query = supabase
        .from("appointments")
        .select("*")
        .order("scheduled_date")
        .order("start_time");
      if (range) {
        query = query.gte("scheduled_date", range.from).lte("scheduled_date", range.to);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as Appointment[];
    },
  });
}

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<Client[]> => {
      const { data, error } = await supabase.from("clients").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as unknown as Client[];
    },
  });
}

function invalidateBooking(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["appointments"] });
  queryClient.invalidateQueries({ queryKey: ["clients"] });
}

export function useSaveAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: Partial<Appointment> & { id?: string }) => {
      const payload = { ...record };
      delete (payload as Record<string, unknown>)["created_at"];
      if (payload.id) {
        const { id, ...rest } = payload;
        const { error } = await supabase
          .from("appointments")
          .update(rest as never)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("appointments").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidateBooking(queryClient);
      toast.success("Agendamento salvo com sucesso.");
    },
    onError: (error: Error) => toast.error(friendly(error.message)),
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateBooking(queryClient);
      toast.success("Status atualizado.");
    },
    onError: (error: Error) => toast.error(friendly(error.message)),
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateBooking(queryClient);
      toast.success("Agendamento excluído.");
    },
    onError: (error: Error) => toast.error(friendly(error.message)),
  });
}

export function useSaveClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: Partial<Client> & { id?: string }) => {
      if (record.id) {
        const { id, ...rest } = record;
        const { error } = await supabase
          .from("clients")
          .update(rest as never)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("clients").insert(record as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidateBooking(queryClient);
      toast.success("Cliente salvo.");
    },
    onError: (error: Error) => toast.error(friendly(error.message)),
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateBooking(queryClient);
      toast.success("Cliente excluído.");
    },
    onError: (error: Error) => toast.error(friendly(error.message)),
  });
}

function friendly(message: string) {
  if (!message) return "Não foi possível concluir a ação.";
  if (message.includes("agendamento neste horário"))
    return "Este barbeiro já possui um agendamento neste horário.";
  if (message.toLowerCase().includes("row-level security"))
    return "Você não tem permissão para esta ação.";
  return message;
}
