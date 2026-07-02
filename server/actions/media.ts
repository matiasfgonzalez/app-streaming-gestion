"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { mediaSchema, type MediaInput } from "@/lib/validations/media";

type ActionResult = { ok: false; error: string } | { ok: true };

function nullify(v?: string) {
  return v && v.length > 0 ? v : null;
}

function toData(d: MediaInput) {
  return {
    type: d.type,
    title: nullify(d.title),
    url: d.type === "IMAGE" ? nullify(d.url) : nullify(d.url),
    youtubeId: d.type === "VIDEO" ? nullify(d.youtubeId) : null,
    caption: nullify(d.caption),
    featured: d.featured,
    order: d.order,
  };
}

function revalidateMedia() {
  revalidatePath("/admin/media");
  revalidatePath("/galeria");
  revalidatePath("/");
}

export async function createMedia(input: MediaInput): Promise<ActionResult> {
  const user = await requireRole("ADMIN", "EDITOR");
  const parsed = mediaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const media = await db.mediaItem.create({ data: toData(parsed.data) });
  await logAudit({
    action: "create",
    entity: "MediaItem",
    entityId: media.id,
    summary: `${parsed.data.type === "VIDEO" ? "Video" : "Imagen"} agregada${parsed.data.title ? `: "${parsed.data.title}"` : ""}`,
    actor: user,
  });
  revalidateMedia();
  redirect("/admin/media");
}

export async function updateMedia(id: string, input: MediaInput): Promise<ActionResult> {
  const user = await requireRole("ADMIN", "EDITOR");
  const parsed = mediaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await db.mediaItem.update({ where: { id }, data: toData(parsed.data) });
  await logAudit({
    action: "update",
    entity: "MediaItem",
    entityId: id,
    summary: `Media actualizada${parsed.data.title ? `: "${parsed.data.title}"` : ""}`,
    actor: user,
  });
  revalidateMedia();
  redirect("/admin/media");
}

export async function deleteMedia(id: string): Promise<void> {
  const user = await requireRole("ADMIN", "EDITOR");
  await db.mediaItem.delete({ where: { id } });
  await logAudit({ action: "delete", entity: "MediaItem", entityId: id, summary: "Media eliminada", actor: user });
  revalidateMedia();
}
