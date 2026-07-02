import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  /** Clave estable de la columna. */
  key: string;
  /** Encabezado (texto de columna y label en la card mobile). */
  header: ReactNode;
  /** Contenido de la celda para una fila. */
  cell: (row: T) => ReactNode;
  /** Clases extra para `<th>`/`<td>` (ancho, alineación fina, etc.). */
  className?: string;
  /** En mobile, esta columna es el título de la card (no se muestra como par label/valor). */
  primary?: boolean;
  /** Columna de acciones: alineada a la derecha en desktop y sin label en mobile. */
  action?: boolean;
  /** Ocultar el label de la columna en la card mobile. */
  hideLabel?: boolean;
};

/**
 * Tabla densa "Enterprise": header sticky + hover de fila en desktop, y en mobile
 * cada fila colapsa a una card (título = columna `primary`, resto como pares
 * label/valor, acciones al pie). Server-only, sin JS. Ver Capa 12.3.
 */
export function DataTable<T>({
  columns,
  rows,
  getKey,
}: {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
}) {
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const dataCols = columns.filter((c) => c !== primary && !c.action);
  const actionCols = columns.filter((c) => c.action);

  return (
    <>
      {/* Desktop — tabla con header sticky y hover de fila */}
      <div className="surface hidden max-h-[calc(100dvh-11rem)] overflow-auto rounded-xl md:block">
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="surface-muted text-eyebrow text-muted-foreground [&_th]:h-11 [&_th]:px-4 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium">
              {columns.map((c) => (
                <th key={c.key} className={cn(c.action && "text-right", c.className)}>
                  {c.action ? <span className="sr-only">{c.header}</span> : c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getKey(row)}
                className="border-t border-border transition-colors hover:bg-muted/50 [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle"
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn(c.action && "text-right", c.className)}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — cada fila como card */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={getKey(row)} className="surface rounded-xl p-4">
            <div className="min-w-0">{primary.cell(row)}</div>
            {dataCols.length > 0 && (
              <dl className="mt-3 space-y-1.5">
                {dataCols.map((c) => (
                  <div key={c.key} className="flex items-baseline justify-between gap-4 text-sm">
                    {!c.hideLabel && (
                      <dt className="text-eyebrow shrink-0 text-muted-foreground">{c.header}</dt>
                    )}
                    <dd className={cn("min-w-0 text-right", c.hideLabel && "w-full")}>
                      {c.cell(row)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {actionCols.length > 0 && (
              <div className="mt-3 flex items-center justify-end gap-1 border-t border-border pt-3">
                {actionCols.map((c) => (
                  <div key={c.key}>{c.cell(row)}</div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
