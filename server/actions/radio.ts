"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify, parseCsv } from "@/lib/slug";
import {
  radioProgramSchema,
  podcastSchema,
  streamingSchema,
  type RadioProgramInput,
  type PodcastInput,
  type StreamingInput,
} from "@/lib/validations/radio";

type ActionResult = { ok: false; error: string } | { ok: true };

function nullify(v?: string) {
  return v && v.length > 0 ? v : null;
}

async function uniqueSlug(
  model: "radioProgram" | "podcast",
  name: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(name) || model;
  let slug = base;
  let n = 1;
  while (true) {
    const existing =
      model === "radioProgram"
        ? await db.radioProgram.findUnique({ where: { slug } })
        : await db.podcast.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function revalidateRadio(slug?: string) {
  revalidatePath("/admin/radio");
  revalidatePath("/radio");
  revalidatePath("/");
  if (slug) revalidatePath(`/radio/${slug}`);
}

// ---------- Programas (+ horarios anidados) ----------
export async function createProgram(input: RadioProgramInput): Promise<ActionResult> {
  await requireRole("ADMIN", "EDITOR");
  const parsed = radioProgramSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  const slug = await uniqueSlug("radioProgram", d.name);
  await db.radioProgram.create({
    data: {
      name: d.name,
      slug,
      description: nullify(d.description),
      hosts: parseCsv(d.hosts),
      guests: parseCsv(d.guests),
      coverUrl: nullify(d.coverUrl),
      active: d.active,
      order: d.order,
      schedules: { create: d.schedules },
    },
  });
  revalidateRadio(slug);
  redirect("/admin/radio");
}

export async function updateProgram(
  id: string,
  input: RadioProgramInput,
): Promise<ActionResult> {
  await requireRole("ADMIN", "EDITOR");
  const parsed = radioProgramSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  const slug = await uniqueSlug("radioProgram", d.name, id);
  // Reemplazo total de horarios (borrar + recrear) dentro de una transacción.
  await db.$transaction([
    db.radioSchedule.deleteMany({ where: { programId: id } }),
    db.radioProgram.update({
      where: { id },
      data: {
        name: d.name,
        slug,
        description: nullify(d.description),
        hosts: parseCsv(d.hosts),
        guests: parseCsv(d.guests),
        coverUrl: nullify(d.coverUrl),
        active: d.active,
        order: d.order,
        schedules: { create: d.schedules },
      },
    }),
  ]);
  revalidateRadio(slug);
  redirect("/admin/radio");
}

export async function deleteProgram(id: string): Promise<void> {
  await requireRole("ADMIN", "EDITOR");
  await db.radioProgram.delete({ where: { id } });
  revalidateRadio();
}

// ---------- Podcasts ----------
export async function createPodcast(input: PodcastInput): Promise<ActionResult> {
  await requireRole("ADMIN", "EDITOR");
  const parsed = podcastSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  const slug = await uniqueSlug("podcast", d.title);
  await db.podcast.create({
    data: {
      title: d.title,
      slug,
      description: nullify(d.description),
      audioUrl: nullify(d.audioUrl),
      youtubeId: nullify(d.youtubeId),
      coverUrl: nullify(d.coverUrl),
      programId: nullify(d.programId),
      publishedAt: d.publishedAt ? new Date(d.publishedAt) : new Date(),
    },
  });
  revalidateRadio();
  redirect("/admin/radio/podcasts");
}

export async function updatePodcast(
  id: string,
  input: PodcastInput,
): Promise<ActionResult> {
  await requireRole("ADMIN", "EDITOR");
  const parsed = podcastSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  const slug = await uniqueSlug("podcast", d.title, id);
  await db.podcast.update({
    where: { id },
    data: {
      title: d.title,
      slug,
      description: nullify(d.description),
      audioUrl: nullify(d.audioUrl),
      youtubeId: nullify(d.youtubeId),
      coverUrl: nullify(d.coverUrl),
      programId: nullify(d.programId),
      publishedAt: d.publishedAt ? new Date(d.publishedAt) : undefined,
    },
  });
  revalidateRadio();
  redirect("/admin/radio/podcasts");
}

export async function deletePodcast(id: string): Promise<void> {
  await requireRole("ADMIN", "EDITOR");
  await db.podcast.delete({ where: { id } });
  revalidateRadio();
}

// ---------- Streaming (SiteSetting) ----------
export async function updateStreaming(input: StreamingInput): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = streamingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  const value = {
    youtubeId: d.youtubeId ?? "",
    facebookUrl: nullify(d.facebookUrl) ?? undefined,
    title: nullify(d.title) ?? undefined,
    channelUrl: nullify(d.channelUrl) ?? undefined,
  };
  await db.siteSetting.upsert({
    where: { key: "streaming" },
    create: { key: "streaming", value },
    update: { value },
  });
  revalidatePath("/admin/radio/streaming");
  revalidatePath("/");
  revalidateRadio();
  redirect("/admin/radio/streaming");
}
