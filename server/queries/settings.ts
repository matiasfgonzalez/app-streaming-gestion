import "server-only";
import { db } from "@/lib/db";
import { mergeSiteConfig, type SiteConfig } from "@/lib/site-config";
import { mergeSectionFlags, type SectionFlags } from "@/lib/sections";
import { mergeTheme, type ThemeConfig } from "@/lib/theme";

export async function getSiteConfig(): Promise<SiteConfig> {
  const row = await db.siteSetting.findUnique({ where: { key: "site" } });
  return mergeSiteConfig(row?.value);
}

export async function getSectionFlags(): Promise<SectionFlags> {
  const row = await db.siteSetting.findUnique({ where: { key: "sections" } });
  return mergeSectionFlags(row?.value);
}

export async function getThemeConfig(): Promise<ThemeConfig> {
  const row = await db.siteSetting.findUnique({ where: { key: "theme" } });
  return mergeTheme(row?.value);
}
