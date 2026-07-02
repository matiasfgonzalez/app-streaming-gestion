import { z } from "zod";

export const mediaSchema = z
  .object({
    type: z.enum(["IMAGE", "VIDEO"]),
    title: z.string().max(160).optional().or(z.literal("")),
    url: z.url("URL inválida").optional().or(z.literal("")),
    youtubeId: z.string().max(40).optional().or(z.literal("")),
    caption: z.string().max(400).optional().or(z.literal("")),
    featured: z.boolean(),
    order: z.number().int().min(0),
  })
  .refine((d) => d.type !== "IMAGE" || (d.url && d.url.length > 0), {
    message: "Subí una imagen",
    path: ["url"],
  })
  .refine((d) => d.type !== "VIDEO" || (d.youtubeId && d.youtubeId.length > 0), {
    message: "Cargá el ID de YouTube",
    path: ["youtubeId"],
  });
export type MediaInput = z.infer<typeof mediaSchema>;
