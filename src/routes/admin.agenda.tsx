import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminShell, EmptyState } from "@/components/admin/AdminShell";
import { AppointmentDialog } from "@/components/admin/AppointmentDialog";
import { SourceBadge, StatusBadge } from "@/components/admin/Badges";
import { useBarbers, useServices } from "@/lib/site-content";
import {
  STATUS_LABEL,
  STATUS_ORDER,
  SOURCE_LABEL,
  addDays,
  endTime,
  formatLongDate,
  shortTime,
  startOfWeek,
  todayISO,
  useAppointments,
  useDeleteAppointment,
  useUpdateAppointmentStatus,
  weekdayName,
  type Appointment,
  type AppointmentSource,
  type AppointmentStatus,
} from "@/lib/booking";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/agenda")({
  component: AgendaPage,
});

type ViewMode = "dia" | "semana" | "lista";

function AgendaPage() {
  const [view, setView] = useState<ViewMode>("dia");
  const [date, setDate] = useState(todayISO());
  const [barberFilter, setBarberFilter] = useState("todos");
  const [serviceFilter, setServiceFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sourceFilter, setSourceFilter] = useState("todos");
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Appointment | null>(null);

  const { data: appointments = [], isLoading } = useAppointments();
  const { data: barbers = [] } = useBarbers(false);
  const { data: services = [] } = useServices(false);
  const updateStatus = useUpdateAppointmentStatus();
  const remove = useDeleteAppointment();

  const weekStart = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  const filtered = useMemo(() => {
    return appointments
      .filter((item) => {
        if (view === "dia" && item.scheduled_date !== date) return false;
        if (view === "semana" && (item.scheduled_date < weekStart || item.scheduled_date > weekDays[6]!))
          return false;
        if (barberFilter !== "todos" && item.barber_id !== barberFilter) return false;
        if (serviceFilter !== "todos" && item.service_id !== serviceFilter) return false;
        if (statusFilter !== "todos" && item.status !== statusFilter) return false;
        if (sourceFilter !== "todos" && item.source !== sourceFilter) return false;
        return true;
      })
      .sort(
        (a, b) =>
          a.scheduled_date.localeCompare(b.scheduled_date) ||
          a.start_time.localeCompare(b.start_time),
      );
  }, [appointments, view, date, weekStart, weekDays, barberFilter, serviceFilter, statusFilter, sourceFilter]);

  const barberName = (id: string | null) => barbers.find((b) => b.id === id)?.name ?? "—";
  const serviceName = (id: string | null) => services.find((s) => s.id === id)?.name ?? "Serviço";

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(item: Appointment) {
    setEditing(item);
    setDialogOpen(true);
  }

  function Row({ item }: { item: Appointment }) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3">
        <div className="w-20 shrink-0">
          <p className="font-display text-xl text-primary">{shortTime(item.start_time)}</p>
          <p className="text-[11px] text-muted-foreground">
            até {endTime(item.start_time, item.duration_minutes)}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-foreground">{item.customer_name || "Sem nome"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {serviceName(item.service_id)} · {barberName(item.barber_id)}
            {view !== "dia" && ` · ${formatLongDate(item.scheduled_date)}`}
          </p>
          {item.customer_phone && (
            <p className="text-xs text-muted-foreground">{item.customer_phone}</p>
          )}
        </div>
        <span className="text-sm text-foreground">{formatPrice(item.price_cents) ?? "—"}</span>
        <SourceBadge source={item.source} />
        <Select
          value={item.status}
          onValueChange={(value) =>
            updateStatus.mutate({ id: item.id, status: value as AppointmentStatus })
          }
        >
          <SelectTrigger className="h-8 w-[150px] text-xs">
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
        <StatusBadge status={item.status} />
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" aria-label="Editar" onClick={() => openEdit(item)}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Excluir" onClick={() => setToDelete(item)}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminShell
      title="Agenda"
      subtitle="Visualize e organize os atendimentos por dia, semana ou lista."
      actions={
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Novo agendamento</span>
        </Button>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            aria-label="Dia anterior"
            onClick={() => setDate(addDays(date, view === "semana" ? -7 : -1))}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <div className="min-w-[190px] text-center">
            <p className="font-display text-xl tracking-wide">{formatLongDate(date)}</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {weekdayName(date)}
            </p>
          </div>
          <Button
            size="icon"
            variant="outline"
            aria-label="Próximo dia"
            onClick={() => setDate(addDays(date, view === "semana" ? 7 : 1))}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDate(todayISO())}>
            Hoje
          </Button>
        </div>

        <Tabs value={view} onValueChange={(value) => setView(value as ViewMode)}>
          <TabsList>
            <TabsTrigger value="dia">Dia</TabsTrigger>
            <TabsTrigger value="semana">Semana</TabsTrigger>
            <TabsTrigger value="lista">Lista</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FilterSelect
          label="Barbeiro"
          value={barberFilter}
          onChange={setBarberFilter}
          options={barbers.map((b) => ({ value: b.id, label: b.name }))}
        />
        <FilterSelect
          label="Serviço"
          value={serviceFilter}
          onChange={setServiceFilter}
          options={services.map((s) => ({ value: s.id, label: s.name }))}
        />
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
        />
        <FilterSelect
          label="Origem"
          value={sourceFilter}
          onChange={setSourceFilter}
          options={(Object.keys(SOURCE_LABEL) as AppointmentSource[]).map((s) => ({
            value: s,
            label: SOURCE_LABEL[s],
          }))}
        />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Carregando agenda…</p>}

        {!isLoading && filtered.length === 0 && (
          <EmptyState
            title="Nenhum agendamento encontrado."
            description="Ajuste os filtros ou cadastre um novo atendimento."
            action={
              <Button variant="gold" onClick={openNew}>
                <Plus className="h-4 w-4" aria-hidden="true" /> Novo agendamento
              </Button>
            }
          />
        )}

        {view === "semana"
          ? weekDays.map((day) => {
              const items = filtered.filter((item) => item.scheduled_date === day);
              if (items.length === 0) return null;
              return (
                <div key={day} className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {weekdayName(day)} · {formatLongDate(day)}
                  </p>
                  {items.map((item) => (
                    <Row key={item.id} item={item} />
                  ))}
                </div>
              );
            })
          : filtered.map((item) => <Row key={item.id} item={item} />)}
      </div>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={editing}
        defaultDate={date}
      />

      <AlertDialog open={Boolean(toDelete)} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este agendamento?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não poderá ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) remove.mutate(toDelete.id);
                setToDelete(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
