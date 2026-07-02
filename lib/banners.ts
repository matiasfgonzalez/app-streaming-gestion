import type { BannerPlacement, SponsorStatus } from "@prisma/client";

export const SPONSOR_STATUS_LABEL: Record<SponsorStatus, string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  EXPIRED: "Vencido",
};

export const BANNER_PLACEMENT_LABEL: Record<BannerPlacement, string> = {
  HOME: "Home",
  NEWS: "Noticias",
  EVENTS: "Eventos",
  SIDEBAR: "Sidebar",
  FOOTER: "Footer",
  HEADER: "Header",
  POPUP: "Popup",
  INLINE: "Entre notas",
  LANDING: "Landing",
};

export const BANNER_PLACEMENTS = Object.keys(
  BANNER_PLACEMENT_LABEL,
) as BannerPlacement[];
