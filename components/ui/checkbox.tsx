import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Checkbox accesible con área táctil ≥44px. Envuelve el input nativo en un
 * label; los props (incluido el `register` de RHF) van al `<input>`.
 */
export function Checkbox({
  className,
  label,
  ...props
}: ComponentProps<"input"> & { label?: ReactNode }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm select-none">
      <input
        type="checkbox"
        className={cn(
          "size-5 shrink-0 rounded-md border-border text-primary accent-[var(--primary)] focus-visible:ring-2 focus-visible:ring-ring/50",
          className,
        )}
        {...props}
      />
      {label && <span className="text-foreground">{label}</span>}
    </label>
  );
}
