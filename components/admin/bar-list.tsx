import { cn } from "@/lib/utils";

export type BarItem = {
  label: string;
  value: number;
  hint?: string;
};

/** Lista de barras horizontales (server-only, sin JS). Escala al máximo. */
export function BarList({
  items,
  emptyLabel = "Sin datos",
  formatValue = (n) => String(n),
}: {
  items: BarItem[];
  emptyLabel?: string;
  formatValue?: (n: number) => string;
}) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={`${item.label}-${i}`} className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate">{item.label}</span>
            <span className="shrink-0 font-medium tabular-nums">
              {item.hint ?? formatValue(item.value)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full bg-primary transition-all")}
              style={{ width: `${Math.max((item.value / max) * 100, item.value > 0 ? 4 : 0)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
