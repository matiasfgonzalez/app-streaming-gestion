import "server-only";
import { db } from "@/lib/db";

const publishedWhere = { status: "PUBLISHED" as const };

/** Últimas noticias publicadas (para landing/listado). */
export function getPublishedNews(take?: number) {
  return db.news.findMany({
    where: publishedWhere,
    orderBy: { publishedAt: "desc" },
    take,
    include: { categories: true, tags: true, author: { select: { name: true } } },
  });
}

/** Noticia breaking más reciente (banner). */
export function getBreakingNews() {
  return db.news.findFirst({
    where: { ...publishedWhere, breaking: true },
    orderBy: { publishedAt: "desc" },
  });
}

export function getNewsBySlug(slug: string) {
  return db.news.findFirst({
    where: { slug, ...publishedWhere },
    include: { categories: true, tags: true, author: { select: { name: true } } },
  });
}

/** Relacionadas: mismas categorías, excluyendo la actual. */
export function getRelatedNews(newsId: string, categoryIds: string[], take = 3) {
  return db.news.findMany({
    where: {
      ...publishedWhere,
      id: { not: newsId },
      categories: categoryIds.length
        ? { some: { id: { in: categoryIds } } }
        : undefined,
    },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

/** Listado completo para el admin (todos los estados). */
export function getAllNewsAdmin() {
  return db.news.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      categories: true,
      tags: true,
      author: { select: { name: true } },
    },
  });
}

export function getNewsById(id: string) {
  return db.news.findUnique({
    where: { id },
    include: { categories: true, tags: true },
  });
}
