import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { inputBase } from "./input";

/**
 * Select nativo estilado con chevron propio (reemplaza los `<select>` crudos).
 * Mantiene el `<select>` nativo por accesibilidad/teclado; solo lo viste.
 */
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          inputBase,
          "min-h-11 appearance-none py-2.5 pl-3.5 pr-10",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}
