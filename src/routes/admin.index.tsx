import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CalendarDays, Clock, Plus, TrendingUp, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminShell, EmptyState, StatCard, useAdminProfile } from "@/components/admin/AdminShell";
import { AppointmentDialog } from "@/components/admin/AppointmentDialog";
import { StatusBadge, SourceBadge } from "@/components/admin/Badges";
import { useBarbers, useServices } from "@/lib/site-content";
import {
  addDays,
  shortTime,
  startOfWeek,
  todayISO,
  useAppointments,
  useClients,
  type Appointment,
} from "@/lib/booking";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

function sumRevenue(items: Appointment[]) {
  return items
    .filter((item) => item.status === "concluido" || item.status === "confirmado")
    .reduce((total, item) => total + (item.price_cents ?? 0), 0);
}

function DashboardPage() {
  const today = todayISO();
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 6);
  const { data: appointments = [], isLoading } = useAppointments();
  const { data: clients = [] } = useClients();
  const { data: barbers = [] } = useBarbers(false);
  const { data: services = [] } = useServices(false);
  const { data: profile } = useAdminProfile();
  const [dialogOpen, setDialogOpen] = useState(false);

  const todays = useMemo(
    () =>
      appointments
        .filter((item) => item.scheduled_date === today)
        .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [appointments, today],
  );

  const week = appointments.filter(
    (item) => item.scheduled_date >= weekStart && item.scheduled_date <= weekEnd,
  );
  const confirmed = todays.filter((item) => item.status === "confirmado");
  const busyMinutes = todays
    .filter((item) => item.status !== "cancelado" && item.status !== "nao_compareceu")
    .reduce((total, item) => total + item.duration_minutes, 0);
  const capacityMinutes = Math.max(barbers.filter((b) => b.is_active).length, 1) * 11 * 60;
  const freeSlots = Math.max(Math.floor((capacityMinutes - busyMinutes) / 30), 0);

  const barberName = (id: string | null) => barbers.find((b) => b.id === id)?.name ?? "—";
  const serviceName = (id: string | null) => services.find((s) => s.id === id)?.name ?? "Serviço";

  return (
    <AdminShell
      title={`Olá, ${profile?.display_name || "ADM"}`}
      subtitle="Confira o movimento da Gireh Barber."
      actions={
        <Button variant="gold" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Novo agendamento</span>
        </Button>
      }
    >
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Agendamentos de hoje" value={todays.length} icon={CalendarDays} />
            <StatCard label="Confirmados hoje" value={confirmed.length} icon={CalendarCheck} />
            <StatCard
              label="Horários disponíveis"
              value={freeSlots}
              hint="Estimativa por blocos de 30 min"
              icon={Clock}
            />
            <StatCard label="Clientes cadastrados" value={clients.length} icon={Users} />
            <StatCard
              label="Faturamento previsto (hoje)"
              value={formatPrice(sumRevenue(todays)) ?? "R$ 0,00"}
              icon={Wallet}
            />
            <StatCard
              label="Faturamento previsto (semana)"
              value={formatPrice(sumRevenue(week)) ?? "R$ 0,00"}
              icon={TrendingUp}
            />
          </div>

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl tracking-wide">Agenda de hoje</h2>
              <Button asChild variant="outlineGold" size="sm">
                <Link to="/admin/agenda">Ver agenda completa</Link>
              </Button>
            </div>

            {todays.length === 0 ? (
              <EmptyState
                title="Nenhum agendamento para hoje."
                description="Cadastre um atendimento manualmente para começar."
                action={
                  <Button variant="gold" onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4" aria-hidden="true" /> Novo agendamento
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-2">
                {todays.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3"
                  >
                    <span className="font-display text-xl text-primary">
                      {shortTime(item.start_time)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{item.customer_name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {serviceName(item.service_id)} · {barberName(item.barber_id)}
                      </p>
                    </div>
                    <SourceBadge source={item.source} />
                    <StatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <AppointmentDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultDate={today} />
    </AdminShell>
  );
}
