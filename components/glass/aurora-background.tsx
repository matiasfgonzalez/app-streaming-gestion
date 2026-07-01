import { cn } from "@/lib/utils";

/**
 * Decorative aurora gradient backdrop. Place inside a `relative` container
 * (or full-screen). Purely presentational; hidden from a11y tree.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        className="animate-aurora absolute -top-1/3 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--aurora-1)" }}
      />
      <div
        className="animate-aurora absolute top-1/4 -left-24 h-[45vh] w-[45vh] rounded-full blur-3xl [animation-delay:-6s]"
        style={{ background: "var(--aurora-2)" }}
      />
      <div
        className="animate-aurora absolute -bottom-24 right-0 h-[50vh] w-[50vh] rounded-full blur-3xl [animation-delay:-12s]"
        style={{ background: "var(--aurora-3)" }}
      />
    </div>
  );
}
