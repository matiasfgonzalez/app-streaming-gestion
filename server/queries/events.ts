import "server-only";
import { db } from "@/lib/db";

/** Eventos públicos ordenados: primero en vivo, luego próximos, luego pasados. */
export async function getPublicEvents() {
  const [live, upcoming, finished] = await Promise.all([
    db.event.findMany({ where: { status: "LIVE" }, orderBy: { startsAt: "asc" } }),
    db.event.findMany({ where: { status: "UPCOMING" }, orderBy: { startsAt: "asc" } }),
    db.event.findMany({ where: { status: "FINISHED" }, orderBy: { startsAt: "desc" }, take: 6 }),
  ]);
  return { live, upcoming, finished };
}

/** Próximos + en vivo para la landing. */
export function getUpcomingEvents(take = 3) {
  return db.event.findMany({
    where: { status: { in: ["UPCOMING", "LIVE"] } },
    orderBy: { startsAt: "asc" },
    take,
  });
}

export function getEventBySlug(slug: string) {
  return db.event.findUnique({ where: { slug } });
}

export function getAllEventsAdmin() {
  return db.event.findMany({ orderBy: { startsAt: "desc" } });
}

export function getEventById(id: string) {
  return db.event.findUnique({ where: { id } });
}

/** Lista simple (id/name) para asociar presupuestos en formularios. */
export function getEventOptions() {
  return db.event.findMany({
    where: { status: { in: ["UPCOMING", "LIVE"] } },
    select: { id: true, name: true },
    orderBy: { startsAt: "asc" },
  });
}
