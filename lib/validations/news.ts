import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(3, "El título es muy corto").max(160),
  excerpt: z.string().min(10, "El resumen es muy corto").max(300),
  content: z.string().min(20, "El contenido es muy corto"),
  coverUrl: z.url("URL inválida").optional().or(z.literal("")),
  videoUrl: z.url("URL inválida").optional().or(z.literal("")),
  podcastUrl: z.url("URL inválida").optional().or(z.literal("")),
  categories: z.string().optional(), // CSV
  tags: z.string().optional(), // CSV
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: z.boolean(),
  breaking: z.boolean(),
});

export type NewsInput = z.infer<typeof newsSchema>;
