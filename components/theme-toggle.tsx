"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Light/dark toggle. Icons are shown via CSS `dark:` variants (no mounted
 * flag needed), so there is no hydration mismatch. The click handler runs
 * on the client where `resolvedTheme` is always defined.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Cambiar tema"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "glass inline-flex size-11 items-center justify-center rounded-full text-foreground transition-all hover:ring-glow active:scale-95",
        className,
      )}
    >
      <Sun className="hidden size-5 dark:block" />
      <Moon className="size-5 dark:hidden" />
    </button>
  );
}
