import { z } from "zod";

// ---------- Package (admin) ----------
export const packageSchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(120),
  description: z.string().min(5, "Descripción muy corta"),
  priceMonthly: z.number("Precio inválido").int().min(0, "Precio inválido"),
  priceWeekly: z.number().int().min(0),
  priceDaily: z.number().int().min(0),
  features: z.string().optional(), // una por línea o CSV
  active: z.boolean(),
  order: z.number().int().min(0),
});
export type PackageInput = z.infer<typeof packageSchema>;

// ---------- Contract (cliente) ----------
export const contractSchema = z.object({
  packageId: z.string().min(1, "Elegí un paquete"),
  billingCycle: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  title: z.string().min(2, "Ingresá un título").max(160),
  description: z.string().max(1000).optional(),
  socials: z.string().max(500).optional(),
  logoUrl: z.url().optional().or(z.literal("")),
  imageUrls: z.array(z.url()).max(6).optional(),
});
export type ContractInput = z.infer<typeof contractSchema>;

// ---------- Contract (admin, sin cliente) ----------
export const adminContractSchema = contractSchema.extend({
  status: z.enum(["DRAFT", "PENDING", "ACTIVE", "REJECTED", "EXPIRED"]),
});
export type AdminContractInput = z.infer<typeof adminContractSchema>;

// ---------- Payment (cliente informa) ----------
export const paymentSchema = z.object({
  contractId: z.string().min(1),
  amount: z.number("Monto inválido").int().min(1, "Monto inválido"),
  method: z.enum(["TRANSFER", "CASH"]),
  proofUrl: z.url().optional().or(z.literal("")),
  notes: z.string().max(500).optional(),
});
export type PaymentInput = z.infer<typeof paymentSchema>;
