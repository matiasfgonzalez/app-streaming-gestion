import { Play } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { getVideos } from "@/server/queries/media";

const FALLBACK = [
  { title: "Resumen del clásico", hue: 300 },
  { title: "Backstage del festival", hue: 40 },
  { title: "Entrevista destacada", hue: 200 },
];

export async function Videos() {
  const videos = await getVideos(3);

  return (
    <Section id="videos">
      <Container>
        <SectionHeading
          eyebrow="Videos"
          title="Reels y clips"
          subtitle="Lo mejor de nuestras coberturas, listo para compartir."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {videos.length > 0
            ? videos.map((v, i) => (
                <Reveal key={v.id} delay={i * 0.08}>
                  <Link
                    href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <GlassCard className="p-3 transition-transform hover:-translate-y-1">
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                          alt={v.title ?? "Video"}
                          className="size-full object-cover"
                        />
                        <span className="ring-glow absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Play className="size-6 translate-x-0.5" />
                        </span>
                      </div>
                      <p className="mt-3 px-1 font-display font-semibold">{v.title ?? "Video"}</p>
                    </GlassCard>
                  </Link>
                </Reveal>
              ))
            : FALLBACK.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.08}>
                  <GlassCard className="p-3 hover:-translate-y-1">
                    <MediaPlaceholder hue={v.hue} className="aspect-video">
                      <span className="ring-glow absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Play className="size-6 translate-x-0.5" />
                      </span>
                    </MediaPlaceholder>
                    <p className="mt-3 px-1 font-display font-semibold">{v.title}</p>
                  </GlassCard>
                </Reveal>
              ))}
        </div>
      </Container>
    </Section>
  );
}
