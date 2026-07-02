"use client";

import { UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Radio, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Role } from "@prisma/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { visibleAdminLinks, type AdminLink } from "./admin-nav";
import { cn } from "@/lib/utils";

/** Activo si es la ruta exacta, o una sub-ruta (salvo el Dashboard raíz `/admin`). */
function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItems({
  links,
  pathname,
  onNavigate,
}: {
  links: AdminLink[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      <p className="text-eyebrow px-3 pb-2 pt-1 text-muted-foreground">Panel</p>
      {links.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "text-foreground/80 hover:bg-muted",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
                active ? "opacity-100" : "opacity-0",
              )}
            />
            <Icon className={cn("size-4.5 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  role,
  userName,
  brandName,
  logoUrl,
  children,
}: {
  role: Role;
  userName: string | null;
  brandName: string;
  logoUrl?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = visibleAdminLinks(role);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar desktop */}
      <aside className="glass sticky top-0 hidden h-dvh flex-col border-y-0 border-l-0 p-4 lg:flex">
        <Brand brandName={brandName} logoUrl={logoUrl} />
        <div className="mt-6 flex-1 overflow-y-auto">
          <NavItems links={links} pathname={pathname} />
        </div>
        <RoleBadge role={role} />
      </aside>

      {/* Columna principal */}
      <div className="flex min-w-0 flex-col">
        <header className="glass safe-top sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-x-0 border-t-0 px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="glass inline-flex size-10 items-center justify-center rounded-full lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <span className="font-display font-semibold lg:hidden">Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userName ?? "Usuario"}
            </span>
            <ThemeToggle />
            <UserButton appearance={{ elements: { avatarBox: "size-9" } }} />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="glass safe-top fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col p-4 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Brand brandName={brandName} logoUrl={logoUrl} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-6 flex-1 overflow-y-auto">
                <NavItems
                  links={links}
                  pathname={pathname}
                  onNavigate={() => setOpen(false)}
                />
              </div>
              <RoleBadge role={role} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Brand({ brandName, logoUrl }: { brandName: string; logoUrl?: string }) {
  // Iniciales del nombre ("Viva La Mañana" → "VLM") para mantener el sidebar compacto.
  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
  return (
    <Link href="/admin" className="flex items-center gap-2 font-display text-lg font-bold">
      {logoUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={logoUrl} alt={brandName} className="size-9 rounded-full object-contain" />
      ) : (
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Radio className="size-5" />
        </span>
      )}
      <span>
        {initials} <span className="text-primary">Admin</span>
      </span>
    </Link>
  );
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-xl border border-border px-3 py-2 text-xs">
      <span className="text-muted-foreground">Rol</span>
      <span className="font-semibold text-primary">{role}</span>
    </div>
  );
}
