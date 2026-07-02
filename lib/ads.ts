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

/** Fecha de fin de vigencia según el ciclo, a partir de la fecha de inicio. */
export function computeEndDate(start: Date, cycle: BillingCycle): Date {
  const d = new Date(start);
  if (cycle === "DAILY") d.setDate(d.getDate() + 1);
  else if (cycle === "WEEKLY") d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

/** Sugerencias de tamaño para las creatividades. */
export const IMAGE_HINTS = {
  logo: "Logo cuadrado, ~500×500px, PNG con fondo transparente. Máx 4MB.",
  image: "Imágenes horizontales ~1200×675px (16:9), JPG/PNG. Máx 4MB c/u, hasta 6.",
} as const;

/** Precio del paquete según el ciclo elegido (cae a mensual si no hay). */
export function priceForCycle(
  pkg: { priceMonthly: number; priceWeekly: number | null; priceDaily: number | null },
  cycle: BillingCycle,
): number {
  if (cycle === "DAILY") return pkg.priceDaily ?? pkg.priceMonthly;
  if (cycle === "WEEKLY") return pkg.priceWeekly ?? pkg.priceMonthly;
  return pkg.priceMonthly;
}
