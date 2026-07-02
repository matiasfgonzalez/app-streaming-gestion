"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/**
 * Notificaciones globales. Sigue el tema (claro/oscuro) y usa los tokens del
 * proyecto vía variables CSS de sonner. `richColors` da éxito/error semánticos.
 */
export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={(resolvedTheme as "light" | "dark") ?? "system"}
      position="top-right"
      richColors
      closeButton
      toastOptions={{ className: "font-sans !rounded-xl" }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
    />
  );
}
