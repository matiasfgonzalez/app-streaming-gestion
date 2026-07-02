import { z } from "zod";

export const roleSchema = z.enum(["ADMIN", "EDITOR", "CLIENTE", "VISITANTE"]);
export type RoleInput = z.infer<typeof roleSchema>;

export const clientProfileSchema = z.object({
  company: z.string().max(160).optional().or(z.literal("")),
  phone: z.string().max(60).optional().or(z.literal("")),
  taxId: z.string().max(60).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});
export type ClientProfileInput = z.infer<typeof clientProfileSchema>;
