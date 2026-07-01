import { CalendarDays, User as UserIcon, Video } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";
import { Container, Section } from "@/components/glass/section";
import { NewsCard, type CardNews } from "@/components/news/news-card";
import { db } from "@/lib/db";
import { formatDate, hueFrom } from "@/lib/format";
import {
  getNewsBySlug,
  getRelatedNews,
} from "@/server/queries/news";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) return { title: "Noticia no encontrada" };
  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: news.coverUrl ? [news.coverUrl] : undefined,
      type: "article",
    },
  };
}

export default async function NoticiaDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) notFound();

  // Contador de vistas (no bloqueante).
  db.news.update({ where: { id: news.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const related = await getRelatedNews(
    news.id,
    news.categories.map((c) => c.id),
  );
  const relatedItems: CardNews[] = related.map((n) => ({
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt,
    category: "Noticias",
    date: formatDate(n.publishedAt),
    coverUrl: n.coverUrl,
    hue: hueFrom(n.slug),
  }));

  return (
    <Section className="pt-24">
      <Container className="max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {news.categories.map((c) => (
            <span key={c.id} className="glass rounded-full px-3 py-1 text-xs font-medium">
              {c.name}
            </span>
          ))}
        </div>
        <h1 className="font-display text-3xl font-bold text-balance sm:text-4xl">
          {news.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UserIcon className="size-4" /> {news.author?.name ?? "Redacción"}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" /> {formatDate(news.publishedAt)}
          </span>
        </div>

        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
          {news.coverUrl ? (
            <Image
              src={news.coverUrl}
              alt={news.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          ) : (
            <MediaPlaceholder hue={hueFrom(news.slug)} className="size-full" />
          )}
        </div>

        <p className="mt-8 text-lg text-pretty text-muted-foreground">{news.excerpt}</p>
        <article className="mt-6 leading-relaxed whitespace-pre-line">
          {news.content}
        </article>

        {news.videoUrl && (
          <Link
            href={news.videoUrl}
            target="_blank"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Video className="size-4" /> Ver video relacionado
          </Link>
        )}

        {news.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {news.tags.map((t) => (
              <span key={t.id} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                #{t.name}
              </span>
            ))}
          </div>
        )}
      </Container>

      {relatedItems.length > 0 && (
        <Container className="mt-16">
          <h2 className="mb-6 font-display text-xl font-bold">Relacionadas</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedItems.map((n) => (
              <NewsCard key={n.slug} news={n} />
            ))}
          </div>
        </Container>
      )}
    </Section>
  );
}
