import { z } from "zod";

export const sponsorSchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(120),
  logoUrl: z.url("URL inválida").optional().or(z.literal("")),
  description: z.string().max(500).optional(),
  website: z.url("URL inválida").optional().or(z.literal("")),
  socials: z.string().max(300).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]),
  order: z.number().int().min(0),
});
export type SponsorInput = z.infer<typeof sponsorSchema>;

export const bannerSchema = z.object({
  title: z.string().max(120).optional(),
  imageUrl: z.url("Subí una imagen"),
  link: z.url("URL inválida").optional().or(z.literal("")),
  placement: z.enum([
    "HOME",
    "NEWS",
    "EVENTS",
    "SIDEBAR",
    "FOOTER",
    "HEADER",
    "POPUP",
    "INLINE",
    "LANDING",
  ]),
  active: z.boolean(),
  order: z.number().int().min(0),
});
export type BannerInput = z.infer<typeof bannerSchema>;
