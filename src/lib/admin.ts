import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type AdminTable = "services" | "barbers" | "plans" | "media_items" | "subscriptions";

const QUERY_KEY: Record<AdminTable, string> = {
  services: "services",
  barbers: "barbers",
  plans: "plans",
  media_items: "media_items",
  subscriptions: "subscriptions",
};

export function useSaveSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Record<string, unknown> }) => {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value } as never, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Conteúdo salvo.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useSaveRecord(table: AdminTable) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: Record<string, unknown>) => {
      const { error } = record["id"]
        ? await supabase.from(table).update(record as never).eq("id", record["id"] as string)
        : await supabase.from(table).insert(record as never);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY[table]] });
      toast.success("Registro salvo.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteRecord(table: AdminTable) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY[table]] });
      toast.success("Registro removido.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
