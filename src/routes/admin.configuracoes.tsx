import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminShell, useAdminProfile } from "@/components/admin/AdminShell";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { defaultSettings, useSiteSettings } from "@/lib/site-content";
import { updateAdminCredentials } from "@/lib/admin-auth.functions";

export const Route = createFileRoute("/admin/configuracoes")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data: settings = defaultSettings } = useSiteSettings();
  const { data: profile, refetch } = useAdminProfile();
  const updateCredentials = useServerFn(updateAdminCredentials);

  const [currentPassword, setCurrentPassword] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCredentials(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateCredentials({
        data: { currentPassword, username, newPassword, displayName },
      });
      toast.success("Credenciais atualizadas.");
      setCurrentPassword("");
      setNewPassword("");
      setUsername("");
      setDisplayName("");
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      title="Configurações"
      subtitle="Horário de funcionamento, avisos e acesso ao painel."
    >
      <div className="space-y-8">
        <SettingsPanel
          settingKey="hours"
          title="Horário de funcionamento"
          description="Usado no site e como referência para a agenda."
          value={settings.hours as unknown as Record<string, unknown>}
          fields={[{ name: "note", label: "Observação", type: "textarea" }]}
          listFields={[
            {
              name: "items",
              label: "Dias",
              itemFields: [
                { name: "day", label: "Dia (ex.: Segunda a sexta)" },
                { name: "hours", label: "Horário (ex.: 09h às 20h)" },
              ],
            },
          ]}
        />

        <SettingsPanel
          settingKey="notifications"
          title="Avisos e lembretes"
          value={settings.notifications as unknown as Record<string, unknown>}
          fields={[
            { name: "enabled", label: "Ativar avisos", type: "boolean" },
            { name: "channels", label: "Canais", type: "list" },
            { name: "renewal_days_before", label: "Lembrete (dias antes)", type: "number" },
            { name: "expiry_days_after", label: "Cobrança (dias depois)", type: "number" },
            { name: "renewal_message", label: "Mensagem de lembrete", type: "textarea" },
            { name: "expiry_message", label: "Mensagem de vencimento", type: "textarea" },
          ]}
        />

        <SettingsPanel
          settingKey="payments"
          title="Pagamentos"
          value={settings.payments as unknown as Record<string, unknown>}
          fields={[
            { name: "provider", label: "Forma principal", type: "text" },
            { name: "enabled", label: "Exibir no site", type: "boolean" },
            { name: "instructions", label: "Instruções", type: "textarea" },
          ]}
        />

        <form
          onSubmit={handleCredentials}
          className="space-y-4 rounded-xl border border-primary/30 bg-surface/60 p-6"
        >
          <div>
            <h3 className="flex items-center gap-2 font-display text-2xl tracking-wide">
              <KeyRound className="h-5 w-5 text-primary" aria-hidden="true" /> Acesso ao painel
            </h3>
            <p className="text-sm text-muted-foreground">
              Usuário atual: {profile?.username ?? "—"} · Nível: {profile?.access_level ?? "—"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cfg-atual">Senha atual</Label>
              <Input
                id="cfg-atual"
                type="password"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cfg-nova">Nova senha (opcional)</Label>
              <Input
                id="cfg-nova"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cfg-user">Novo usuário (opcional)</Label>
              <Input
                id="cfg-user"
                maxLength={60}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cfg-nome">Nome exibido (opcional)</Label>
              <Input
                id="cfg-nome"
                maxLength={80}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </div>
          </div>

          <Button type="submit" variant="gold" disabled={saving}>
            Salvar credenciais
          </Button>
        </form>
      </div>
    </AdminShell>
  );
}
