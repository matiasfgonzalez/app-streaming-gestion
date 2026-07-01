import { cn } from "@/lib/utils";

// Static bar heights so SSR/client match; animation is pure CSS.
const BARS = [
  30, 55, 40, 70, 90, 60, 45, 80, 35, 65, 50, 85, 40, 60, 75, 45, 90, 55, 35,
  70, 50, 80, 60, 40, 65, 85, 45, 55, 75, 50,
];

/** Decorative animated audio waveform (bars). */
export function Waveform({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex h-10 items-center gap-[3px]", className)}
    >
      {BARS.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-current opacity-80 motion-safe:animate-pulse"
          style={{
            height: `${h}%`,
            animationDelay: `${(i % 10) * 90}ms`,
            animationDuration: "1100ms",
          }}
        />
      ))}
    </div>
  );
}
