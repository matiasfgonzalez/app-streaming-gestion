import {
  Newspaper,
  CalendarDays,
  Users,
  FileText,
  Megaphone,
  Handshake,
  CreditCard,
  DollarSign,
  MousePointerClick,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { BarList } from "@/components/admin/bar-list";
import { requireRole } from "@/lib/auth";
import { getDashboardData } from "@/server/queries/analytics";
import { formatMoney } from "@/lib/format";

export const metadata = { title: "Dashboard" };

const QUOTE_LABEL: Record<string, string> = {
  NEW: "Nuevos",
  IN_REVIEW: "En revisión",
  QUOTED: "Presupuestados",
  CLOSED: "Cerrados",
};
const CONTRACT_LABEL: Record<string, string> = {
  DRAFT: "Borrador",
  PENDING: "Pendiente",
  ACTIVE: "Activo",
  REJECTED: "Rechazado",
  EXPIRED: "Vencido",
};

function Kpi({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" />
      </div>
      <div className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</div>
    </GlassCard>
  );
}

function CtrCard({
  title,
  clicks,
  impressions,
  rate,
}: {
  title: string;
  clicks: number;
  impressions: number;
  rate: number;
}) {
  return (
    <GlassCard className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <MousePointerClick className="size-4 text-primary" />
      </div>
      <div className="font-display text-2xl font-bold tabular-nums">{rate.toFixed(1)}%</div>
      <p className="text-xs text-muted-foreground tabular-nums">
        {clicks.toLocaleString("es-AR")} clicks · {impressions.toLocaleString("es-AR")} impresiones
      </p>
    </GlassCard>
  );
}

export default async function AdminDashboard() {
  const user = await requireRole("ADMIN", "EDITOR");
  const d = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Hola, {user.name ?? "bienvenido"} 👋</h1>
        <p className="text-sm text-muted-foreground">Panel de métricas de Viva La Mañana.</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Usuarios" value={d.counts.users} icon={Users} />
        <Kpi label="Noticias" value={d.counts.news} icon={Newspaper} />
        <Kpi label="Eventos" value={d.counts.events} icon={CalendarDays} />
        <Kpi label="Presupuestos nuevos" value={d.counts.quotesNew} icon={FileText} />
        <Kpi label="Ingresos aprobados" value={formatMoney(d.revenue)} icon={DollarSign} />
        <Kpi label="Contratos activos" value={d.counts.contractsActive} icon={Megaphone} />
        <Kpi label="Sponsors activos" value={d.counts.sponsorsActive} icon={Handshake} />
        <Kpi label="Pagos pendientes" value={d.counts.pendingPayments} icon={CreditCard} />
      </div>

      {/* CTR publicidad */}
      <div className="grid gap-4 sm:grid-cols-2">
        <CtrCard title="CTR Banners" {...d.ctr.banners} />
        <CtrCard title="CTR Sponsors" {...d.ctr.sponsors} />
      </div>

      {/* Rankings */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="space-y-4">
          <h2 className="font-display font-semibold">Noticias más vistas</h2>
          <BarList
            items={d.topNews.map((n) => ({ label: n.title, value: n.views }))}
            emptyLabel="Sin noticias con vistas."
          />
        </GlassCard>
        <GlassCard className="space-y-4">
          <h2 className="font-display font-semibold">Eventos más vistos</h2>
          <BarList
            items={d.topEvents.map((e) => ({ label: e.name, value: e.views }))}
            emptyLabel="Sin eventos con vistas."
          />
        </GlassCard>
      </div>

      {/* Distribuciones */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="space-y-4">
          <h2 className="font-display font-semibold">Presupuestos por estado</h2>
          <BarList
            items={d.quotesByStatus.map((q) => ({ label: QUOTE_LABEL[q.key] ?? q.key, value: q.value }))}
            emptyLabel="Sin presupuestos."
          />
        </GlassCard>
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Contratos por estado</h2>
            <Link href="/admin/publicidad" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <BarList
            items={d.contractsByStatus.map((c) => ({ label: CONTRACT_LABEL[c.key] ?? c.key, value: c.value }))}
            emptyLabel="Sin contratos."
          />
        </GlassCard>
      </div>
    </div>
  );
}
