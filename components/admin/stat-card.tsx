import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { GlassCard } from "@/components/glass/glass-card";
import { cn } from "@/lib/utils";

/** Mini gráfico de línea (server-only, sin JS). `data` = serie temporal. */
export function Sparkline({
  data,
  color = "var(--primary)",
  className,
}: {
  data: number[];
  color?: string;
  className?: string;
}) {
  const series = data.length >= 2 ? data : [...data, ...data, 0];
  const w = 100;
  const h = 30;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min || 1;
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = pts.join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("h-8 w-full", className)}
      aria-hidden
    >
      <polygon points={`0,${h} ${line} ${w},${h}`} fill={color} fillOpacity={0.1} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Delta porcentual con flecha de tendencia. `null` = sin base para comparar. */
export function DeltaBadge({ value }: { value: number | null }) {
  if (value == null) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
        value === 0
          ? "text-muted-foreground"
          : up
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-destructive",
      )}
    >
      <Icon className="size-3.5" />
      {up ? "+" : ""}
      {value.toFixed(0)}%
    </span>
  );
}

/**
 * KPI destacado (glass): valor grande + delta + sparkline. `highlight` lo marca
 * como métrica principal (glow + ícono en primary). Para secundarios usar `StatMini`.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  series,
  seriesColor,
  highlight,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  delta?: number | null;
  series?: number[];
  seriesColor?: string;
  highlight?: boolean;
}) {
  return (
    <GlassCard className={cn("flex flex-col gap-3", highlight && "ring-glow")}>
      <div className="flex items-center justify-between">
        <span className="text-eyebrow text-muted-foreground">{label}</span>
        <span
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg",
            highlight ? "bg-primary text-primary-foreground" : "surface-muted text-primary",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="font-display text-3xl font-bold tnum">{value}</span>
        {delta !== undefined && <DeltaBadge value={delta} />}
      </div>
      {series && <Sparkline data={series} color={seriesColor ?? "var(--primary)"} />}
    </GlassCard>
  );
}

/** KPI secundario compacto (surface plano) — jerarquía por debajo de `StatCard`. */
export function StatMini({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="surface flex items-center gap-3 rounded-xl p-4">
      <span className="surface-muted inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <div className="font-display text-xl font-bold tnum leading-tight">{value}</div>
        <div className="truncate text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
