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
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "text-foreground/80 hover:bg-muted",
            )}
          >
            <Icon className="size-4.5" />
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
  children,
}: {
  role: Role;
  userName: string | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = visibleAdminLinks(role);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar desktop */}
      <aside className="glass sticky top-0 hidden h-dvh flex-col border-y-0 border-l-0 p-4 lg:flex">
        <Brand />
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
                <Brand />
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

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Radio className="size-5" />
      </span>
      <span>
        VLM <span className="text-primary">Admin</span>
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
