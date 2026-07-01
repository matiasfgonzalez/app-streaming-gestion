import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto").max(160),
  description: z.string().min(10, "La descripción es muy corta"),
  venue: z.string().max(160).optional(),
  address: z.string().max(200).optional(),
  startsAt: z.string().min(1, "Indicá fecha y hora de inicio"), // datetime-local
  endsAt: z.string().optional(),
  status: z.enum(["UPCOMING", "LIVE", "FINISHED"]),
  coverUrl: z.url("URL inválida").optional().or(z.literal("")),
  artists: z.string().optional(), // CSV
  hosts: z.string().optional(), // CSV
});

export type EventInput = z.infer<typeof eventSchema>;
