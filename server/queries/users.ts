import "server-only";
import { db } from "@/lib/db";

export function getAllUsers() {
  return db.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    include: {
      clientProfile: true,
      _count: { select: { news: true, contracts: true } },
    },
  });
}

export function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      clientProfile: true,
      contracts: {
        orderBy: { createdAt: "desc" },
        include: { package: { select: { name: true } } },
      },
      _count: { select: { news: true, contracts: true } },
    },
  });
}
