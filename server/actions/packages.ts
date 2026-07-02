"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { packageSchema, type PackageInput } from "@/lib/validations/ads";

type ActionResult = { ok: false; error: string } | { ok: true };

async function uniqueSlug(name: string, ignoreId?: string): Promise<string> {
  const base = slugify(name) || "paquete";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await db.package.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function parseFeatures(input?: string): string[] {
  if (!input) return [];
  return input
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toData(d: PackageInput) {
  return {
    name: d.name,
    description: d.description,
    priceMonthly: d.priceMonthly,
    priceWeekly: d.priceWeekly && d.priceWeekly > 0 ? d.priceWeekly : null,
    priceDaily: d.priceDaily && d.priceDaily > 0 ? d.priceDaily : null,
    features: parseFeatures(d.features),
    active: d.active,
    order: d.order,
  };
}

function revalidatePackages() {
  revalidatePath("/admin/paquetes");
  revalidatePath("/");
  revalidatePath("/cliente/contratar");
}

export async function createPackage(input: PackageInput): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const slug = await uniqueSlug(parsed.data.name);
  await db.package.create({ data: { ...toData(parsed.data), slug } });
  revalidatePackages();
  redirect("/admin/paquetes");
}

export async function updatePackage(
  id: string,
  input: PackageInput,
): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const slug = await uniqueSlug(parsed.data.name, id);
  await db.package.update({ where: { id }, data: { ...toData(parsed.data), slug } });
  revalidatePackages();
  redirect("/admin/paquetes");
}

export async function deletePackage(id: string): Promise<void> {
  await requireRole("ADMIN");
  await db.package.delete({ where: { id } });
  revalidatePackages();
}
