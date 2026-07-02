import {
  Home,
  Newspaper,
  Radio,
  CalendarDays,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** Primary navigation shared by navbar, drawer and bottom-nav. */
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/noticias", label: "Noticias", icon: Newspaper },
  { href: "/radio", label: "Radio", icon: Radio },
  { href: "/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/#publicidad", label: "Publicidad", icon: Megaphone },
];
