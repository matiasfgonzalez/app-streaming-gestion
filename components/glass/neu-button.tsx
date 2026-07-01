import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const neuButton = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:brightness-110 hover:ring-glow",
        secondary:
          "bg-secondary text-secondary-foreground hover:brightness-110",
        neu: "neu text-foreground hover:brightness-[0.98]",
        glass: "glass text-foreground hover:ring-glow",
        ghost: "text-foreground hover:bg-muted",
        outline: "border border-border text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-13 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type NeuButtonProps = ComponentProps<"button"> & VariantProps<typeof neuButton>;

/**
 * Brand button with neumorphic/glass/primary variants and a subtle glow.
 * To style a link as a button, apply `neuButton(...)` to the `<Link>` className.
 */
export function NeuButton({
  className,
  variant,
  size,
  ...props
}: NeuButtonProps) {
  return (
    <button className={cn(neuButton({ variant, size }), className)} {...props} />
  );
}

export { neuButton };
