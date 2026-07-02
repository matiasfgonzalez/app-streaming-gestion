import "server-only";
import type { BannerPlacement } from "@prisma/client";
import { db } from "@/lib/db";

// ---------- Sponsors ----------
export function getActiveSponsors() {
  return db.sponsor.findMany({
    where: { status: "ACTIVE" },
    orderBy: { order: "asc" },
  });
}

export function getAllSponsorsAdmin() {
  return db.sponsor.findMany({ orderBy: { order: "asc" } });
}

export function getSponsorById(id: string) {
  return db.sponsor.findUnique({ where: { id } });
}

/** Suma una impresión a todos los sponsors activos (proxy simple de métricas). */
export function bumpSponsorImpressions() {
  return db.sponsor.updateMany({
    where: { status: "ACTIVE" },
    data: { impressions: { increment: 1 } },
  });
}

// ---------- Banners ----------
export function getBannersByPlacement(placement: BannerPlacement) {
  return db.banner.findMany({
    where: { active: true, placement },
    orderBy: { order: "asc" },
  });
}

export function getAllBannersAdmin() {
  return db.banner.findMany({ orderBy: [{ placement: "asc" }, { order: "asc" }] });
}

export function getBannerById(id: string) {
  return db.banner.findUnique({ where: { id } });
}
