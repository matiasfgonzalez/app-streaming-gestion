import "server-only";
import { db } from "@/lib/db";

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

const DAYS = 14;
const DAY_MS = 86_400_000;

/** Inicio (00:00 local) del primer día de la ventana de `DAYS`. */
function windowStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return new Date(d.getTime() - (DAYS - 1) * DAY_MS);
}

/** Suma valores en `DAYS` cubetas diarias según `createdAt`. `weight` pondera (p.ej. monto). */
function bucketize(rows: { createdAt: Date; weight?: number }[], start: Date): number[] {
  const out = new Array<number>(DAYS).fill(0);
  for (const r of rows) {
    const i = Math.floor((r.createdAt.getTime() - start.getTime()) / DAY_MS);
    if (i >= 0 && i < DAYS) out[i] += r.weight ?? 1;
  }
  return out;
}

/** Delta % entre la última mitad y la anterior de la serie. `null` si no hay base. */
function deltaOf(series: number[]): number | null {
  const half = series.length / 2;
  const prev = series.slice(0, half).reduce((a, b) => a + b, 0);
  const last = series.slice(half).reduce((a, b) => a + b, 0);
  if (prev === 0) return last > 0 ? 100 : null;
  return ((last - prev) / prev) * 100;
}

/** Métricas del panel: conteos, ingresos, CTR y rankings. */
export async function getDashboardData() {
  const since = windowStart();
  const [
    users,
    news,
    events,
    quotesNew,
    contractsActive,
    sponsorsActive,
    bannersActive,
    pendingPayments,
    revenueAgg,
    bannerAgg,
    sponsorAgg,
    quotesByStatusRaw,
    contractsByStatusRaw,
    topNews,
    topEvents,
    newsDates,
    eventDates,
    userDates,
    quoteDates,
    revenueDates,
  ] = await Promise.all([
    db.user.count(),
    db.news.count(),
    db.event.count(),
    db.quoteRequest.count({ where: { status: "NEW" } }),
    db.adContract.count({ where: { status: "ACTIVE" } }),
    db.sponsor.count({ where: { status: "ACTIVE" } }),
    db.banner.count({ where: { active: true } }),
    db.payment.count({ where: { status: "PENDING" } }),
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "APPROVED" } }),
    db.banner.aggregate({ _sum: { clicks: true, impressions: true } }),
    db.sponsor.aggregate({ _sum: { clicks: true, impressions: true } }),
    db.quoteRequest.groupBy({ by: ["status"], _count: { _all: true } }),
    db.adContract.groupBy({ by: ["status"], _count: { _all: true } }),
    db.news.findMany({
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, views: true },
    }),
    db.event.findMany({
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, name: true, slug: true, views: true },
    }),
    db.news.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.event.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.quoteRequest.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.payment.findMany({
      where: { status: "APPROVED", createdAt: { gte: since } },
      select: { createdAt: true, amount: true },
    }),
  ]);

  const series = {
    news: bucketize(newsDates, since),
    events: bucketize(eventDates, since),
    users: bucketize(userDates, since),
    quotes: bucketize(quoteDates, since),
    revenue: bucketize(
      revenueDates.map((p) => ({ createdAt: p.createdAt, weight: p.amount })),
      since,
    ),
  };
  const deltas = {
    news: deltaOf(series.news),
    events: deltaOf(series.events),
    users: deltaOf(series.users),
    quotes: deltaOf(series.quotes),
    revenue: deltaOf(series.revenue),
  };

  const ctr = (clicks: number, impressions: number) =>
    impressions > 0 ? (clicks / impressions) * 100 : 0;

  const bannerClicks = bannerAgg._sum.clicks ?? 0;
  const bannerImpr = bannerAgg._sum.impressions ?? 0;
  const sponsorClicks = sponsorAgg._sum.clicks ?? 0;
  const sponsorImpr = sponsorAgg._sum.impressions ?? 0;

  return {
    counts: {
      users,
      news,
      events,
      quotesNew,
      contractsActive,
      sponsorsActive,
      bannersActive,
      pendingPayments,
    },
    revenue: revenueAgg._sum.amount ?? 0,
    ctr: {
      banners: { clicks: bannerClicks, impressions: bannerImpr, rate: ctr(bannerClicks, bannerImpr) },
      sponsors: { clicks: sponsorClicks, impressions: sponsorImpr, rate: ctr(sponsorClicks, sponsorImpr) },
    },
    quotesByStatus: quotesByStatusRaw.map((q) => ({ key: q.status, value: q._count._all })),
    contractsByStatus: contractsByStatusRaw.map((c) => ({ key: c.status, value: c._count._all })),
    topNews,
    topEvents,
    series,
    deltas,
  };
}

export function getAuditLogs(take = 100) {
  return db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take });
}
