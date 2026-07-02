"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { mergeSectionFlags } from "@/lib/sections";
import {
  siteConfigSchema,
  sectionFlagsSchema,
  type SiteConfigInput,
  type SectionFlagsInput,
} from "@/lib/validations/settings";
import { themeSchema, type ThemeInput } from "@/lib/validations/theme";

type ActionResult = { ok: false; error: string } | { ok: true };

/** La landing y el layout público se revalidan de raíz al cambiar la config. */
function revalidatePublic() {
  revalidatePath("/", "layout");
}

export async function updateSiteConfig(input: SiteConfigInput): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");
  const parsed = siteConfigSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await db.siteSetting.upsert({
    where: { key: "site" },
    create: { key: "site", value: parsed.data },
    update: { value: parsed.data },
  });
  await logAudit({
    action: "update",
    entity: "SiteSetting",
    entityId: "site",
    summary: "Configuración general actualizada",
    actor: admin,
  });
  revalidatePublic();
  revalidatePath("/admin/configuracion");
  redirect("/admin/configuracion");
}

export async function updateSectionFlags(input: SectionFlagsInput): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");
  const parsed = sectionFlagsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  // Normalizamos contra las secciones conocidas antes de persistir.
  const value = mergeSectionFlags(parsed.data);
  await db.siteSetting.upsert({
    where: { key: "sections" },
    create: { key: "sections", value },
    update: { value },
  });
  await logAudit({
    action: "update",
    entity: "SiteSetting",
    entityId: "sections",
    summary: `Secciones actualizadas (${Object.values(value).filter(Boolean).length} activas)`,
    actor: admin,
  });
  revalidatePublic();
  revalidatePath("/admin/configuracion/secciones");
  redirect("/admin/configuracion/secciones");
}

export async function updateTheme(input: ThemeInput): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");
  const parsed = themeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await db.siteSetting.upsert({
    where: { key: "theme" },
    create: { key: "theme", value: parsed.data },
    update: { value: parsed.data },
  });
  await logAudit({
    action: "update",
    entity: "SiteSetting",
    entityId: "theme",
    summary: "Tema del sitio actualizado",
    actor: admin,
  });
  revalidatePublic();
  revalidatePath("/admin/configuracion/tema");
  redirect("/admin/configuracion/tema");
}
