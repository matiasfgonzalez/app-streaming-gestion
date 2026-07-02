import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Placeholder de carga. Respeta `prefers-reduced-motion` (el pulso se apaga).
 * Base para los `loading.tsx` de la Capa 12.2.
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-lg bg-muted motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
