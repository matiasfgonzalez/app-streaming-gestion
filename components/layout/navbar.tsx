"use client";

import { Menu, Radio } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { neuButton } from "@/components/glass/neu-button";
import { Container } from "@/components/glass/section";
import { MobileDrawer } from "./mobile-drawer";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <header className="safe-top sticky top-0 z-40 w-full">
      <div className="glass border-x-0 border-t-0">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="ring-glow inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Radio className="size-5" />
            </span>
            <span className="hidden sm:inline">
              Viva La <span className="text-primary">Mañana</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <UserButton appearance={{ elements: { avatarBox: "size-9" } }} />
            ) : (
              <Link
                href="/sign-in"
                className={cn(neuButton({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}
              >
                Ingresar
              </Link>
            )}
            <ThemeToggle />
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="glass inline-flex size-11 items-center justify-center rounded-full lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </Container>
      </div>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
