import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

/** Centered, responsive content container. Mobile-first max widths. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

/** Vertical rhythm wrapper for landing sections. */
export function Section({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("relative py-16 sm:py-20 lg:py-24", className)}
      {...props}
    />
  );
}

/** Section heading with eyebrow + title + optional subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <p className="text-eyebrow mb-3 text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold text-balance sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-pretty text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
