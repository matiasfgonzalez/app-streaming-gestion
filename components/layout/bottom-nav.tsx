"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "./mobile-menu-context";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";

/** Mobile bottom navigation. Hidden on desktop and while the drawer is open. */
export function BottomNav() {
  const pathname = usePathname();
  const { open } = useMobileMenu();

  return (
    <nav
      aria-hidden={open}
      className={cn(
        "safe-bottom fixed inset-x-0 bottom-0 z-40 transition-transform duration-200 lg:hidden",
        open && "pointer-events-none translate-y-full",
      )}
    >
      <div className="glass mx-auto flex max-w-md items-center justify-around gap-1 rounded-t-2xl px-2 py-2">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("size-5", active && "text-glow")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
