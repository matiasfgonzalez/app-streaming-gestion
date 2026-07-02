"use client";

import { LayoutDashboard, LogIn, Menu, Radio } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { neuButton } from "@/components/glass/neu-button";
import { Container } from "@/components/glass/section";
import { MobileDrawer } from "./mobile-drawer";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  // Rol vive en la DB (no en Clerk): lo consultamos solo con sesión, así el
  // landing anónimo sigue siendo estático (no forzamos render dinámico).
  useEffect(() => {
    if (!isSignedIn) return;
    let active = true;
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d) setIsStaff(!!d.isStaff);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isSignedIn]);

  // Derivado: si no hay sesión, nunca mostramos el acceso a admin.
  const showAdmin = !!isSignedIn && isStaff;

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
            {showAdmin && (
              <Link
                href="/admin"
                className="ml-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <LayoutDashboard className="size-4" /> Administración
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <>
                {showAdmin && (
                  <Link
                    href="/admin"
                    aria-label="Administración"
                    className={cn(
                      neuButton({ variant: "glass", size: "icon" }),
                      "lg:hidden",
                    )}
                  >
                    <LayoutDashboard className="size-5" />
                  </Link>
                )}
                <Link
                  href="/cliente"
                  className={cn(neuButton({ variant: "glass", size: "sm" }), "hidden sm:inline-flex")}
                >
                  Mi cuenta
                </Link>
                <UserButton appearance={{ elements: { avatarBox: "size-9" } }} />
              </>
            ) : (
              <Link href="/sign-in" className={neuButton({ variant: "primary", size: "sm" })}>
                <LogIn className="size-4" />
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

      <MobileDrawer open={open} onClose={() => setOpen(false)} isStaff={showAdmin} />
    </header>
  );
}
