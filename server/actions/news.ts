"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify, parseCsv } from "@/lib/slug";
import { newsSchema, type NewsInput } from "@/lib/validations/news";

type ActionResult = { ok: false; error: string } | { ok: true };

/** Genera un slug único para News (agrega sufijo si colisiona). */
async function uniqueSlug(title: string, ignoreId?: string): Promise<string> {
  const base = slugify(title) || "noticia";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await db.news.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

/** connectOrCreate para taxonomías (Category/Tag) a partir de nombres CSV. */
function taxonomyConnect(names: string[]) {
  return names.map((name) => {
    const slug = slugify(name);
    return {
      where: { slug },
      create: { name, slug },
    };
  });
}

function clean(url?: string) {
  return url && url.length > 0 ? url : null;
}

export async function createNews(input: NewsInput): Promise<ActionResult> {
  const user = await requireRole("ADMIN", "EDITOR");
  const parsed = newsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const slug = await uniqueSlug(d.title);
  await db.news.create({
    data: {
      title: d.title,
      slug,
      excerpt: d.excerpt,
      content: d.content,
      coverUrl: clean(d.coverUrl),
      videoUrl: clean(d.videoUrl),
      podcastUrl: clean(d.podcastUrl),
      status: d.status,
      featured: d.featured,
      breaking: d.breaking,
      publishedAt: d.status === "PUBLISHED" ? new Date() : null,
      authorId: user.id,
      categories: { connectOrCreate: taxonomyConnect(parseCsv(d.categories)) },
      tags: { connectOrCreate: taxonomyConnect(parseCsv(d.tags)) },
    },
  });

  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
  revalidatePath("/");
  redirect("/admin/noticias");
}

export async function updateNews(
  id: string,
  input: NewsInput,
): Promise<ActionResult> {
  await requireRole("ADMIN", "EDITOR");
  const parsed = newsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const current = await db.news.findUnique({ where: { id } });
  if (!current) return { ok: false, error: "Noticia no encontrada" };

  const slug = await uniqueSlug(d.title, id);
  const nowPublished = d.status === "PUBLISHED";

  await db.news.update({
    where: { id },
    data: {
      title: d.title,
      slug,
      excerpt: d.excerpt,
      content: d.content,
      coverUrl: clean(d.coverUrl),
      videoUrl: clean(d.videoUrl),
      podcastUrl: clean(d.podcastUrl),
      status: d.status,
      featured: d.featured,
      breaking: d.breaking,
      // Fija publishedAt la primera vez que se publica; lo limpia si vuelve a borrador.
      publishedAt: nowPublished ? (current.publishedAt ?? new Date()) : null,
      categories: {
        set: [],
        connectOrCreate: taxonomyConnect(parseCsv(d.categories)),
      },
      tags: {
        set: [],
        connectOrCreate: taxonomyConnect(parseCsv(d.tags)),
      },
    },
  });

  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${slug}`);
  revalidatePath("/");
  redirect("/admin/noticias");
}

export async function deleteNews(id: string): Promise<void> {
  await requireRole("ADMIN", "EDITOR");
  await db.news.delete({ where: { id } });
  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
  revalidatePath("/");
}
