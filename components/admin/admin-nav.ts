import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  FileText,
  Radio,
  Megaphone,
  Package,
  CreditCard,
  Users,
  Image as ImageIcon,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@prisma/client";

export type AdminLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Roles que pueden ver el ítem. Vacío = ADMIN y EDITOR. */
  roles?: Role[];
};

/**
 * Navegación del panel. Muchos destinos aún no existen (se crean en sus fases);
 * el shell queda listo para poblarse. Ver docs/06.
 */
export const ADMIN_LINKS: AdminLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/presupuestos", label: "Presupuestos", icon: FileText },
  { href: "/admin/radio", label: "Radio", icon: Radio },
  { href: "/admin/publicidad", label: "Publicidad", icon: Megaphone, roles: ["ADMIN"] },
  { href: "/admin/paquetes", label: "Paquetes", icon: Package, roles: ["ADMIN"] },
  { href: "/admin/pagos", label: "Pagos", icon: CreditCard, roles: ["ADMIN"] },
  { href: "/admin/media", label: "Galería", icon: ImageIcon },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, roles: ["ADMIN"] },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, roles: ["ADMIN"] },
];

export function visibleAdminLinks(role: Role): AdminLink[] {
  return ADMIN_LINKS.filter(
    (l) => !l.roles || l.roles.includes(role),
  );
}
