import "server-only";
import { db } from "@/lib/db";

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

/** Métricas del panel: conteos, ingresos, CTR y rankings. */
export async function getDashboardData() {
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
  ]);

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
  };
}

export function getAuditLogs(take = 100) {
  return db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take });
}
