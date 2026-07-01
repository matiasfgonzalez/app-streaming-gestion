import "server-only";
import { db } from "@/lib/db";

export function getAllQuotes() {
  return db.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: { select: { name: true } } },
  });
}

export function getNewQuotesCount() {
  return db.quoteRequest.count({ where: { status: "NEW" } });
}
