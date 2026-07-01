"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify, parseCsv } from "@/lib/slug";
import { eventSchema, type EventInput } from "@/lib/validations/event";

type ActionResult = { ok: false; error: string } | { ok: true };

async function uniqueSlug(name: string, ignoreId?: string): Promise<string> {
  const base = slugify(name) || "evento";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await db.event.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function toData(d: EventInput) {
  return {
    name: d.name,
    description: d.description,
    venue: d.venue || null,
    address: d.address || null,
    startsAt: new Date(d.startsAt),
    endsAt: d.endsAt ? new Date(d.endsAt) : null,
    status: d.status,
    coverUrl: d.coverUrl && d.coverUrl.length > 0 ? d.coverUrl : null,
    artists: parseCsv(d.artists),
    hosts: parseCsv(d.hosts),
  };
}

function revalidateEvents(slug?: string) {
  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  if (slug) revalidatePath(`/eventos/${slug}`);
  revalidatePath("/");
}

export async function createEvent(input: EventInput): Promise<ActionResult> {
  await requireRole("ADMIN", "EDITOR");
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const slug = await uniqueSlug(parsed.data.name);
  await db.event.create({ data: { ...toData(parsed.data), slug } });
  revalidateEvents(slug);
  redirect("/admin/eventos");
}

export async function updateEvent(
  id: string,
  input: EventInput,
): Promise<ActionResult> {
  await requireRole("ADMIN", "EDITOR");
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const slug = await uniqueSlug(parsed.data.name, id);
  await db.event.update({ where: { id }, data: { ...toData(parsed.data), slug } });
  revalidateEvents(slug);
  redirect("/admin/eventos");
}

export async function deleteEvent(id: string): Promise<void> {
  await requireRole("ADMIN", "EDITOR");
  await db.event.delete({ where: { id } });
  revalidateEvents();
}
