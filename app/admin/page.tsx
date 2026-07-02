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
  GalleryHorizontalEnd,
} from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { BarList } from "@/components/admin/bar-list";
import { StatCard, StatMini } from "@/components/admin/stat-card";
import { requireRole } from "@/lib/auth";
import { getDashboardData } from "@/server/queries/analytics";
import { getSiteConfig } from "@/server/queries/settings";
import { formatMoney } from "@/lib/format";

export const metadata = { title: "Dashboard" };

const QUOTE_LABEL: Record<string, string> = {
  NEW: "Nuevos",
  IN_REVIEW: "En revisión",
  QUOTED: "Presupuestados",
  CLOSED: "Cerrados",
};
const QUOTE_COLOR: Record<string, string> = {
  NEW: "var(--primary)",
  IN_REVIEW: "oklch(0.75 0.15 75)",
  QUOTED: "var(--accent)",
  CLOSED: "oklch(0.70 0.15 160)",
};
const CONTRACT_LABEL: Record<string, string> = {
  DRAFT: "Borrador",
  PENDING: "Pendiente",
  ACTIVE: "Activo",
  REJECTED: "Rechazado",
  EXPIRED: "Vencido",
};
const CONTRACT_COLOR: Record<string, string> = {
  DRAFT: "var(--muted-foreground)",
  PENDING: "oklch(0.75 0.15 75)",
  ACTIVE: "oklch(0.70 0.15 160)",
  REJECTED: "var(--destructive)",
  EXPIRED: "var(--muted-foreground)",
};

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
      <div className="font-display text-2xl font-bold tnum">{rate.toFixed(1)}%</div>
      <p className="text-xs text-muted-foreground tnum">
        {clicks.toLocaleString("es-AR")} clicks · {impressions.toLocaleString("es-AR")} impresiones
      </p>
    </GlassCard>
  );
}

export default async function AdminDashboard() {
  const user = await requireRole("ADMIN", "EDITOR");
  const [d, site] = await Promise.all([getDashboardData(), getSiteConfig()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Hola, {user.name ?? "bienvenido"} 👋</h1>
        <p className="text-sm text-muted-foreground">
          Panel de métricas de {site.brandName} · últimos 14 días.
        </p>
      </div>

      {/* KPIs principales — con tendencia y sparkline */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Ingresos aprobados"
          value={formatMoney(d.revenue)}
          icon={DollarSign}
          delta={d.deltas.revenue}
          series={d.series.revenue}
          seriesColor="var(--primary)"
          highlight
        />
        <StatCard
          label="Usuarios"
          value={d.counts.users}
          icon={Users}
          delta={d.deltas.users}
          series={d.series.users}
          seriesColor="var(--secondary)"
        />
        <StatCard
          label="Presupuestos nuevos"
          value={d.counts.quotesNew}
          icon={FileText}
          delta={d.deltas.quotes}
          series={d.series.quotes}
          seriesColor="var(--accent)"
        />
      </div>

      {/* KPIs secundarios — compactos, sin jerarquía de sparkline */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatMini label="Noticias" value={d.counts.news} icon={Newspaper} />
        <StatMini label="Eventos" value={d.counts.events} icon={CalendarDays} />
        <StatMini label="Contratos activos" value={d.counts.contractsActive} icon={Megaphone} />
        <StatMini label="Sponsors activos" value={d.counts.sponsorsActive} icon={Handshake} />
        <StatMini label="Banners activos" value={d.counts.bannersActive} icon={GalleryHorizontalEnd} />
        <StatMini label="Pagos pendientes" value={d.counts.pendingPayments} icon={CreditCard} />
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

      {/* Distribuciones — color por estado */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="space-y-4">
          <h2 className="font-display font-semibold">Presupuestos por estado</h2>
          <BarList
            items={d.quotesByStatus.map((q) => ({
              label: QUOTE_LABEL[q.key] ?? q.key,
              value: q.value,
              color: QUOTE_COLOR[q.key],
            }))}
            emptyLabel="Sin presupuestos."
          />
        </GlassCard>
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Contratos por estado</h2>
            <Link href="/admin/publicidad" className="text-xs text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <BarList
            items={d.contractsByStatus.map((c) => ({
              label: CONTRACT_LABEL[c.key] ?? c.key,
              value: c.value,
              color: CONTRACT_COLOR[c.key],
            }))}
            emptyLabel="Sin contratos."
          />
        </GlassCard>
      </div>
    </div>
  );
}
