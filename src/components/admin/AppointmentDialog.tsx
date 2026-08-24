import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBarbers, useServices } from "@/lib/site-content";
import {
  STATUS_LABEL,
  STATUS_ORDER,
  SOURCE_LABEL,
  overlaps,
  shortTime,
  todayISO,
  useAppointments,
  useClients,
  useSaveAppointment,
  useSaveClient,
  type Appointment,
  type AppointmentSource,
  type AppointmentStatus,
} from "@/lib/booking";

type Draft = {
  id?: string;
  customer_name: string;
  customer_phone: string;
  client_id: string | null;
  service_id: string | null;
  barber_id: string | null;
  scheduled_date: string;
  start_time: string;
  duration_minutes: number;
  price_cents: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  notes: string;
};

function emptyDraft(date?: string): Draft {
  return {
    customer_name: "",
    customer_phone: "",
    client_id: null,
    service_id: null,
    barber_id: null,
    scheduled_date: date ?? todayISO(),
    start_time: "09:00",
    duration_minutes: 30,
    price_cents: 0,
    status: "confirmado",
    source: "manual",
    notes: "",
  };
}

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  appointment?: Appointment | null;
  defaultDate?: string;
}) {
  const { data: services = [] } = useServices(false);
  const { data: barbers = [] } = useBarbers(false);
  const { data: clients = [] } = useClients();
  const { data: appointments = [] } = useAppointments();
  const save = useSaveAppointment();
  const saveClient = useSaveClient();
  const [draft, setDraft] = useState<Draft>(emptyDraft(defaultDate));
  const [priceInput, setPriceInput] = useState("0,00");

  useEffect(() => {
    if (!open) return;
    if (appointment) {
      setDraft({
        id: appointment.id,
        customer_name: appointment.customer_name,
        customer_phone: appointment.customer_phone,
        client_id: appointment.client_id,
        service_id: appointment.service_id,
        barber_id: appointment.barber_id,
        scheduled_date: appointment.scheduled_date,
        start_time: shortTime(appointment.start_time),
        duration_minutes: appointment.duration_minutes,
        price_cents: appointment.price_cents,
        status: appointment.status,
        source: appointment.source,
        notes: appointment.notes,
      });
      setPriceInput((appointment.price_cents / 100).toFixed(2).replace(".", ","));
    } else {
      setDraft(emptyDraft(defaultDate));
      setPriceInput("0,00");
    }
  }, [open, appointment, defaultDate]);

  const conflict = useMemo(() => {
    if (!draft.barber_id) return null;
    const clash = appointments.find(
      (item) =>
        item.id !== draft.id &&
        item.barber_id === draft.barber_id &&
        item.scheduled_date === draft.scheduled_date &&
        item.status !== "cancelado" &&
        item.status !== "nao_compareceu" &&
        overlaps(draft.start_time, draft.duration_minutes, item.start_time, item.duration_minutes),
    );
    return clash ?? null;
  }, [appointments, draft]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function pickService(id: string) {
    const service = services.find((item) => item.id === id);
    setDraft((current) => ({
      ...current,
      service_id: id,
      duration_minutes: service?.duration_minutes ?? current.duration_minutes,
      price_cents: service?.price_cents ?? current.price_cents,
    }));
    if (service?.price_cents != null) {
      setPriceInput((service.price_cents / 100).toFixed(2).replace(".", ","));
    }
  }

  function pickClient(id: string) {
    if (id === "novo") {
      setDraft((current) => ({ ...current, client_id: null }));
      return;
    }
    const client = clients.find((item) => item.id === id);
    setDraft((current) => ({
      ...current,
      client_id: id,
      customer_name: client?.name ?? current.customer_name,
      customer_phone: client?.phone ?? current.customer_phone,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (conflict) return;
    let clientId = draft.client_id;
    if (!clientId && draft.customer_name.trim()) {
      const existing = clients.find(
        (item) =>
          item.name.toLowerCase() === draft.customer_name.trim().toLowerCase() ||
          (draft.customer_phone && item.phone === draft.customer_phone),
      );
      if (existing) clientId = existing.id;
      else {
        await saveClient.mutateAsync({
          name: draft.customer_name.trim(),
          phone: draft.customer_phone.trim(),
        });
      }
    }
    save.mutate(
      { ...draft, client_id: clientId },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wide">
            {appointment ? "Editar agendamento" : "Novo agendamento"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do atendimento. O sistema bloqueia horários conflitantes para o mesmo
            barbeiro.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Cliente cadastrado</Label>
              <Select value={draft.client_id ?? "novo"} onValueChange={pickClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo cliente</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ap-nome">Nome do cliente</Label>
              <Input
                id="ap-nome"
                required
                maxLength={80}
                value={draft.customer_name}
                onChange={(event) => set("customer_name", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ap-tel">Telefone</Label>
              <Input
                id="ap-tel"
                maxLength={25}
                placeholder="(22) 99999-9999"
                value={draft.customer_phone}
                onChange={(event) => set("customer_phone", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Serviço</Label>
              <Select value={draft.service_id ?? ""} onValueChange={pickService}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Barbeiro</Label>
              <Select
                value={draft.barber_id ?? ""}
                onValueChange={(value) => set("barber_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar barbeiro" />
                </SelectTrigger>
                <SelectContent>
                  {barbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ap-data">Data</Label>
              <Input
                id="ap-data"
                type="date"
                required
                value={draft.scheduled_date}
                onChange={(event) => set("scheduled_date", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ap-hora">Horário</Label>
              <Input
                id="ap-hora"
                type="time"
                required
                value={draft.start_time}
                onChange={(event) => set("start_time", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ap-dur">Duração (min)</Label>
              <Input
                id="ap-dur"
                type="number"
                min={5}
                step={5}
                value={draft.duration_minutes}
                onChange={(event) => set("duration_minutes", Number(event.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ap-valor">Valor (R$)</Label>
              <Input
                id="ap-valor"
                inputMode="decimal"
                value={priceInput}
                onChange={(event) => {
                  setPriceInput(event.target.value);
                  const parsed = Number(event.target.value.replace(/\./g, "").replace(",", "."));
                  set("price_cents", Number.isFinite(parsed) ? Math.round(parsed * 100) : 0);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={draft.status}
                onValueChange={(value) => set("status", value as AppointmentStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Origem</Label>
              <Select
                value={draft.source}
                onValueChange={(value) => set("source", value as AppointmentSource)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SOURCE_LABEL) as AppointmentSource[]).map((source) => (
                    <SelectItem key={source} value={source}>
                      {SOURCE_LABEL[source]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ap-obs">Observação</Label>
              <Textarea
                id="ap-obs"
                rows={3}
                maxLength={500}
                value={draft.notes}
                onChange={(event) => set("notes", event.target.value)}
              />
            </div>
          </div>

          {conflict && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              Este barbeiro já tem um atendimento das {shortTime(conflict.start_time)} nesse dia.
              Escolha outro horário ou profissional.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="gold" disabled={save.isPending || Boolean(conflict)}>
              Salvar agendamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
