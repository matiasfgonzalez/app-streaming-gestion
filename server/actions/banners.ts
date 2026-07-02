"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  sponsorSchema,
  bannerSchema,
  type SponsorInput,
  type BannerInput,
} from "@/lib/validations/banners";

type ActionResult = { ok: false; error: string } | { ok: true };

function nullify(v?: string) {
  return v && v.length > 0 ? v : null;
}

// ---------- Sponsors ----------
export async function createSponsor(input: SponsorInput): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = sponsorSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  await db.sponsor.create({
    data: {
      name: d.name,
      logoUrl: nullify(d.logoUrl),
      description: nullify(d.description),
      website: nullify(d.website),
      socials: nullify(d.socials),
      status: d.status,
      order: d.order,
    },
  });
  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
  revalidatePath("/");
  redirect("/admin/sponsors");
}

export async function updateSponsor(
  id: string,
  input: SponsorInput,
): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = sponsorSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  await db.sponsor.update({
    where: { id },
    data: {
      name: d.name,
      logoUrl: nullify(d.logoUrl),
      description: nullify(d.description),
      website: nullify(d.website),
      socials: nullify(d.socials),
      status: d.status,
      order: d.order,
    },
  });
  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
  revalidatePath("/");
  redirect("/admin/sponsors");
}

export async function deleteSponsor(id: string): Promise<void> {
  await requireRole("ADMIN");
  await db.sponsor.delete({ where: { id } });
  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
  revalidatePath("/");
}

// ---------- Banners ----------
export async function createBanner(input: BannerInput): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  await db.banner.create({
    data: {
      title: nullify(d.title),
      imageUrl: d.imageUrl,
      link: nullify(d.link),
      placement: d.placement,
      active: d.active,
      order: d.order,
    },
  });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function updateBanner(
  id: string,
  input: BannerInput,
): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  await db.banner.update({
    where: { id },
    data: {
      title: nullify(d.title),
      imageUrl: d.imageUrl,
      link: nullify(d.link),
      placement: d.placement,
      active: d.active,
      order: d.order,
    },
  });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string): Promise<void> {
  await requireRole("ADMIN");
  await db.banner.delete({ where: { id } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
