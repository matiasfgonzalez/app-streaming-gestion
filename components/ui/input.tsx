import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Estilo base compartido para controles de formulario (input, textarea, select).
 * Fuente única de verdad — reemplaza el `inputCls` que se repetía en 17 forms.
 */
export const inputBase =
  "w-full rounded-xl border border-border bg-background/60 text-sm text-foreground outline-none transition-[color,box-shadow,border-color] placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60";

/** Clase lista para usar en `<input>`/`<select>` nativos (target ≥44px). */
export const inputCls = cn(inputBase, "min-h-11 px-3.5 py-2.5");

/** Texto de campo (input una línea). */
export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputCls, className)} {...props} />;
}

/** Área de texto multilínea. */
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(inputBase, "min-h-24 px-3.5 py-2.5 leading-relaxed", className)}
      {...props}
    />
  );
}
