import { z } from "zod";

const SERVICE_VALUES = [
  "INTERNET",
  "STREAMING",
  "FOTOS",
  "VIDEOS",
  "CONDUCTOR",
  "PUBLICIDAD",
  "REDES",
  "COMMUNITY_MANAGER",
  "ENTREVISTAS",
  "COBERTURA",
] as const;

export const quoteSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre").max(120),
  contact: z.string().min(5, "Dejá un email o teléfono de contacto").max(160),
  services: z
    .array(z.enum(SERVICE_VALUES))
    .min(1, "Elegí al menos un servicio"),
  venue: z.string().max(200).optional(),
  dates: z.string().max(200).optional(),
  schedule: z.string().max(200).optional(),
  details: z.string().max(2000).optional(),
  eventId: z.string().optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
