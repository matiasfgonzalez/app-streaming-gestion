import { CalendarDays, MapPin, Mic, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/glass/glass-card";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";
import { neuButton } from "@/components/glass/neu-button";
import { Container, Section } from "@/components/glass/section";
import { db } from "@/lib/db";
import { EVENT_STATUS_LABEL, mapEmbedUrl } from "@/lib/events";
import { formatDateTime, hueFrom } from "@/lib/format";
import { getEventBySlug } from "@/server/queries/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ev = await getEventBySlug(slug);
  if (!ev) return { title: "Evento no encontrado" };
  return {
    title: ev.name,
    description: ev.description.slice(0, 160),
    openGraph: {
      title: ev.name,
      images: ev.coverUrl ? [ev.coverUrl] : undefined,
    },
  };
}

export default async function EventoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ev = await getEventBySlug(slug);
  if (!ev) notFound();

  db.event.update({ where: { id: ev.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const mapQuery = ev.address || ev.venue;

  return (
    <Section className="pt-24">
      <Container className="max-w-4xl">
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          {ev.coverUrl ? (
            <Image
              src={ev.coverUrl}
              alt={ev.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          ) : (
            <MediaPlaceholder hue={hueFrom(ev.slug)} icon={CalendarDays} className="size-full" />
          )}
          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-medium">
            {EVENT_STATUS_LABEL[ev.status]}
          </span>
        </div>

        <h1 className="mt-8 font-display text-3xl font-bold text-balance sm:text-4xl">
          {ev.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" /> {formatDateTime(ev.startsAt)}
            {ev.endsAt && ` — ${formatDateTime(ev.endsAt)}`}
          </span>
          {ev.venue && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {ev.venue}
            </span>
          )}
        </div>

        <article className="mt-6 leading-relaxed whitespace-pre-line">
          {ev.description}
        </article>

        {(ev.artists.length > 0 || ev.hosts.length > 0) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ev.artists.length > 0 && (
              <GlassCard>
                <p className="mb-2 flex items-center gap-1.5 font-display font-semibold">
                  <Users className="size-4 text-primary" /> Artistas
                </p>
                <p className="text-sm text-muted-foreground">{ev.artists.join(", ")}</p>
              </GlassCard>
            )}
            {ev.hosts.length > 0 && (
              <GlassCard>
                <p className="mb-2 flex items-center gap-1.5 font-display font-semibold">
                  <Mic className="size-4 text-primary" /> Conductores
                </p>
                <p className="text-sm text-muted-foreground">{ev.hosts.join(", ")}</p>
              </GlassCard>
            )}
          </div>
        )}

        {mapQuery && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <iframe
              title={`Mapa de ${ev.name}`}
              src={mapEmbedUrl(mapQuery)}
              className="aspect-video w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <div className="mt-8">
          <Link href="/eventos#presupuesto" className={neuButton()}>
            Solicitar presupuesto para mi evento
          </Link>
        </div>
      </Container>
    </Section>
  );
}
