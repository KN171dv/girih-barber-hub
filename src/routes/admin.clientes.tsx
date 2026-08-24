import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/Badges";
import {
  formatLongDate,
  shortTime,
  useAppointments,
  useClients,
  useDeleteClient,
  useSaveClient,
  type Client,
} from "@/lib/booking";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/admin/clientes")({
  component: ClientsPage,
});

const EMPTY: Partial<Client> = { name: "", phone: "", email: "", notes: "" };

function ClientsPage() {
  const { data: clients = [], isLoading } = useClients();
  const { data: appointments = [] } = useAppointments();
  const save = useSaveClient();
  const remove = useDeleteClient();
  const [term, setTerm] = useState("");
  const [editing, setEditing] = useState<Partial<Client> | null>(null);
  const [detail, setDetail] = useState<Client | null>(null);

  const filtered = useMemo(() => {
    const query = term.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) || (client.phone ?? "").includes(query),
    );
  }, [clients, term]);

  function historyOf(client: Client) {
    return appointments
      .filter(
        (item) =>
          item.client_id === client.id ||
          (client.phone && item.customer_phone === client.phone),
      )
      .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));
  }

  return (
    <AdminShell
      title="Clientes"
      subtitle="Cadastro, histórico e contato rápido."
      actions={
        <Button variant="gold" onClick={() => setEditing({ ...EMPTY })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Novo cliente</span>
        </Button>
      }
    >
      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          className="pl-9"
          placeholder="Buscar por nome ou telefone"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          aria-label="Buscar cliente"
        />
      </div>

      <div className="mt-6 space-y-2">
        {isLoading && <p className="text-sm text-muted-foreground">Carregando clientes…</p>}
        {!isLoading && filtered.length === 0 && (
          <EmptyState title="Nenhum cliente encontrado." description="Cadastre o primeiro cliente." />
        )}
        {filtered.map((client) => {
          const history = historyOf(client);
          return (
            <div
              key={client.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{client.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {client.phone || "sem telefone"} · {history.length} atendimento(s)
                </p>
              </div>
              {client.phone && (
                <Button asChild size="sm" variant="outline">
                  <a
                    href={whatsappLink(client.phone, `Olá, ${client.name}!`) ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              )}
              <Button size="sm" variant="outlineGold" onClick={() => setDetail(client)}>
                Histórico
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Editar cliente"
                onClick={() => setEditing({ ...client })}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Excluir cliente"
                onClick={() => remove.mutate(client.id)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          );
        })}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar cliente" : "Novo cliente"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!editing) return;
              save.mutate(editing, { onSuccess: () => setEditing(null) });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="c-nome">Nome</Label>
              <Input
                id="c-nome"
                required
                maxLength={120}
                value={editing?.name ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-tel">Telefone</Label>
                <Input
                  id="c-tel"
                  maxLength={30}
                  value={editing?.phone ?? ""}
                  onChange={(event) =>
                    setEditing((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-mail">E-mail</Label>
                <Input
                  id="c-mail"
                  type="email"
                  maxLength={255}
                  value={editing?.email ?? ""}
                  onChange={(event) =>
                    setEditing((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-obs">Observações</Label>
              <Textarea
                id="c-obs"
                rows={3}
                maxLength={1000}
                value={editing?.notes ?? ""}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, notes: event.target.value }))
                }
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button type="submit" variant="gold" disabled={save.isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de {detail?.name}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {detail && historyOf(detail).length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum atendimento registrado.</p>
            )}
            {detail &&
              historyOf(detail).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/40 px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-foreground">{formatLongDate(item.scheduled_date)}</p>
                    <p className="text-xs text-muted-foreground">{shortTime(item.start_time)}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            {detail?.notes && (
              <p className="rounded-lg bg-surface/40 p-3 text-xs text-muted-foreground">
                {detail.notes}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
