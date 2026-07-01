import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Gradient placeholder for images (no external assets in Fase 1).
 * `hue` drives the gradient tint; optional icon overlay.
 */
export function MediaPlaceholder({
  hue = 40,
  icon: Icon,
  className,
  children,
}: {
  hue?: number;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, oklch(0.68 0.17 ${hue}), oklch(0.55 0.16 ${(hue + 90) % 360}))`,
      }}
      aria-hidden={!children}
    >
      <div className="absolute inset-0 bg-black/10" />
      {Icon && (
        <Icon className="absolute inset-0 m-auto size-10 text-white/70" />
      )}
      {children}
    </div>
  );
}
