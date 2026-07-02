import type {
  BillingCycle,
  ContractStatus,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  DRAFT: "Borrador",
  PENDING: "Pendiente",
  ACTIVE: "Activa",
  REJECTED: "Rechazada",
  EXPIRED: "Vencida",
};

export const BILLING_CYCLE_LABEL: Record<BillingCycle, string> = {
  DAILY: "Por día",
  WEEKLY: "Semanal",
  MONTHLY: "Mensual",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  TRANSFER: "Transferencia",
  CASH: "Efectivo",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

/** Precio del paquete según el ciclo elegido (cae a mensual si no hay). */
export function priceForCycle(
  pkg: { priceMonthly: number; priceWeekly: number | null; priceDaily: number | null },
  cycle: BillingCycle,
): number {
  if (cycle === "DAILY") return pkg.priceDaily ?? pkg.priceMonthly;
  if (cycle === "WEEKLY") return pkg.priceWeekly ?? pkg.priceMonthly;
  return pkg.priceMonthly;
}
