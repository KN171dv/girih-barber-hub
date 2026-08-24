import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, CalendarRange, Receipt, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminShell, EmptyState, StatCard } from "@/components/admin/AdminShell";
import { useBarbers, useServices } from "@/lib/site-content";
import { addDays, formatLongDate, todayISO, useAppointments } from "@/lib/booking";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/admin/financeiro")({
  component: FinancePage,
});

function FinancePage() {
  const today = todayISO();
  const [from, setFrom] = useState(addDays(today, -29));
  const [to, setTo] = useState(today);
  const { data: appointments = [] } = useAppointments();
  const { data: barbers = [] } = useBarbers(false);
  const { data: services = [] } = useServices(false);

  const inRange = useMemo(
    () =>
      appointments.filter(
        (item) =>
          item.scheduled_date >= from &&
          item.scheduled_date <= to &&
          item.status !== "cancelado" &&
          item.status !== "nao_compareceu",
      ),
    [appointments, from, to],
  );

  const total = inRange.reduce((sum, item) => sum + (item.price_cents ?? 0), 0);
  const done = inRange.filter((item) => item.status === "concluido");
  const received = done.reduce((sum, item) => sum + (item.price_cents ?? 0), 0);
  const ticket = inRange.length ? Math.round(total / inRange.length) : 0;

  const byBarber = barbers
    .map((barber) => {
      const items = inRange.filter((item) => item.barber_id === barber.id);
      return {
        name: barber.name,
        atendimentos: items.length,
        valor: items.reduce((sum, item) => sum + (item.price_cents ?? 0), 0) / 100,
      };
    })
    .filter((row) => row.atendimentos > 0);

  const byService = services
    .map((service) => {
      const items = inRange.filter((item) => item.service_id === service.id);
      return {
        name: service.name,
        count: items.length,
        value: items.reduce((sum, item) => sum + (item.price_cents ?? 0), 0),
      };
    })
    .filter((row) => row.count > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <AdminShell title="Financeiro" subtitle="Relatórios simples por período, barbeiro e serviço.">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fin-de">De</Label>
          <Input
            id="fin-de"
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fin-ate">Até</Label>
          <Input id="fin-ate" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </div>
        <p className="pb-2 text-xs text-muted-foreground">
          {formatLongDate(from)} — {formatLongDate(to)}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Faturamento previsto" value={formatPrice(total) ?? "R$ 0,00"} icon={Wallet} />
        <StatCard label="Já concluído" value={formatPrice(received) ?? "R$ 0,00"} icon={Receipt} />
        <StatCard label="Atendimentos" value={inRange.length} icon={CalendarRange} />
        <StatCard label="Ticket médio" value={formatPrice(ticket) ?? "R$ 0,00"} icon={BarChart3} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-2xl tracking-wide">Faturamento por barbeiro</h2>
        {byBarber.length === 0 ? (
          <EmptyState title="Nenhum atendimento no período." />
        ) : (
          <div className="h-72 rounded-xl border border-border bg-surface/50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byBarber}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                  }}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Faturamento"]}
                />
                <Bar dataKey="valor" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-2xl tracking-wide">Serviços mais vendidos</h2>
        {byService.length === 0 ? (
          <EmptyState title="Sem dados no período." />
        ) : (
          <ul className="space-y-2">
            {byService.map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3"
              >
                <span className="text-sm text-foreground">{row.name}</span>
                <span className="text-xs text-muted-foreground">
                  {row.count}x · {formatPrice(row.value)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}
