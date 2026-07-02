export type BarItem = {
  label: string;
  value: number;
  hint?: string;
  /** Color de la barra (CSS). Si se omite, cicla la paleta por serie. */
  color?: string;
};

/** Paleta por serie: naranja marca → violeta → cian. */
const PALETTE = ["var(--primary)", "var(--secondary)", "var(--accent)"];

/** Lista de barras horizontales, multicolor por serie (server-only, sin JS). */
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
      {items.map((item, i) => {
        const color = item.color ?? PALETTE[i % PALETTE.length];
        return (
          <li key={`${item.label}-${i}`} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate">{item.label}</span>
              </span>
              <span className="shrink-0 font-medium tabular-nums">
                {item.hint ?? formatValue(item.value)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max((item.value / max) * 100, item.value > 0 ? 4 : 0)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
