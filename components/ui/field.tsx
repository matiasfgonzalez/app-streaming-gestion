import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Clase de etiqueta compartida (drop-in para `<label>` nativos). */
export const labelCls = "mb-1.5 block text-sm font-medium text-foreground";

/** Etiqueta de formulario (contraste AA sobre glass). */
export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn(labelCls, className)} {...props} />;
}

/** Mensaje de error de un campo. */
export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-destructive">{children}</p>;
}

/** Ayuda/descripción de un campo. */
export function FieldHint({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-muted-foreground">{children}</p>;
}

/**
 * Campo compuesto: label + control + error/hint con el espaciado correcto.
 * Uso: <Field label="Título" htmlFor="title" error={errors.title?.message}><Input id="title" .../></Field>
 */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      <FieldError>{error}</FieldError>
      {!error && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}
