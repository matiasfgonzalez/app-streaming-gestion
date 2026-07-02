import { z } from "zod";
import { LANDING_SECTIONS } from "@/lib/sections";

const optUrl = z.url("URL inválida").optional().or(z.literal(""));

export const siteConfigSchema = z.object({
  brandName: z.string().min(1, "Requerido").max(80),
  tagline: z.string().max(120).optional().or(z.literal("")),
  description: z.string().max(400).optional().or(z.literal("")),
  logoUrl: optUrl,
  coverUrl: optUrl,
  contact: z.object({
    email: z.email("Email inválido").optional().or(z.literal("")),
    phone: z.string().max(60).optional().or(z.literal("")),
    address: z.string().max(200).optional().or(z.literal("")),
    mapsUrl: optUrl,
  }),
  socials: z.object({
    instagram: optUrl,
    facebook: optUrl,
    youtube: optUrl,
    tiktok: optUrl,
    whatsapp: optUrl,
  }),
  seo: z.object({
    title: z.string().max(120).optional().or(z.literal("")),
    description: z.string().max(320).optional().or(z.literal("")),
  }),
});
export type SiteConfigInput = z.infer<typeof siteConfigSchema>;

export const sectionFlagsSchema = z.object(
  Object.fromEntries(LANDING_SECTIONS.map((s) => [s.key, z.boolean()])),
) as z.ZodType<Record<string, boolean>>;
export type SectionFlagsInput = z.infer<typeof sectionFlagsSchema>;
