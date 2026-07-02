import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Primitivos de tabla densa (Dashboard Enterprise). La adopción de listas→tablas
 * ocurre en la Capa 12.3; acá se define la base reutilizable.
 * Envolver `Table` en un contenedor con overflow-x-auto para responsive.
 */
export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "text-eyebrow text-muted-foreground [&_th]:h-10 [&_th]:px-3 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "[&_tr]:border-t [&_tr]:border-border [&_td]:px-3 [&_td]:py-3 [&_td]:align-middle",
        className,
      )}
      {...props}
    />
  );
}

export function TR({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr className={cn("transition-colors hover:bg-muted/50", className)} {...props} />
  );
}
