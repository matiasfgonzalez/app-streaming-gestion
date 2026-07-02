"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/configuracion", label: "General" },
  { href: "/admin/configuracion/secciones", label: "Secciones" },
  { href: "/admin/configuracion/tema", label: "Tema" },
];

export function SettingsTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 rounded-xl border border-border bg-background/40 p-1">
      {TABS.map((t) => {
        const active =
          t.href === "/admin/configuracion"
            ? pathname === "/admin/configuracion"
            : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
