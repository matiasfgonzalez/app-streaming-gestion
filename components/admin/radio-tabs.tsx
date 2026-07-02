"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/radio", label: "Programas" },
  { href: "/admin/radio/podcasts", label: "Podcasts" },
  { href: "/admin/radio/streaming", label: "Streaming" },
];

export function RadioTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 rounded-xl border border-border bg-background/40 p-1">
      {TABS.map((t) => {
        const active =
          t.href === "/admin/radio"
            ? pathname === "/admin/radio" || pathname.startsWith("/admin/radio/nuevo") || /^\/admin\/radio\/[^/]+\/editar$/.test(pathname)
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
