import "server-only";
import { db } from "@/lib/db";

// ---------- Packages ----------
export function getActivePackages() {
  return db.package.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

export function getAllPackagesAdmin() {
  return db.package.findMany({ orderBy: { order: "asc" } });
}

export function getPackageById(id: string) {
  return db.package.findUnique({ where: { id } });
}

// ---------- Contracts ----------
export function getClientContracts(clientId: string) {
  return db.adContract.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    include: {
      package: true,
      payments: { orderBy: { createdAt: "desc" } },
      creatives: true,
    },
  });
}

export function getContractForClient(id: string, clientId: string) {
  return db.adContract.findFirst({
    where: { id, clientId },
    include: {
      package: true,
      payments: { orderBy: { createdAt: "desc" } },
      creatives: true,
    },
  });
}

export function getAllContractsAdmin() {
  return db.adContract.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      package: true,
      client: { select: { name: true, email: true } },
      payments: true,
    },
  });
}

// ---------- Payments ----------
export function getAllPayments() {
  return db.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contract: {
        include: {
          package: { select: { name: true } },
          client: { select: { name: true, email: true } },
        },
      },
    },
  });
}

export function getPendingPaymentsCount() {
  return db.payment.count({ where: { status: "PENDING" } });
}
