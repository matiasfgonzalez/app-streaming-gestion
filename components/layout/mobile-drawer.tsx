"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";

/** Slide-in navigation drawer for mobile/tablet. */
export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="glass safe-top fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col gap-2 p-5 lg:hidden"
            role="dialog"
            aria-label="Menú de navegación"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-bold">Menú</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú"
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "hover:bg-muted",
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              );
            })}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
