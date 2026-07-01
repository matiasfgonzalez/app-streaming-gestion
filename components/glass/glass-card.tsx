import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

/** Translucent glass surface with blur and soft border. */
export function GlassCard({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-5 shadow-lg shadow-black/5",
        "transition-transform duration-300 will-change-transform",
        className,
      )}
      {...props}
    />
  );
}
