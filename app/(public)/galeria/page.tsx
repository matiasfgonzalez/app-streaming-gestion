import { GlassCard } from "@/components/glass/glass-card";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { getGalleryImages, getVideos } from "@/server/queries/media";

export const metadata = {
  title: "Galería",
  description: "Fotos y videos de Viva La Mañana: eventos, coberturas y detrás de escena.",
};

export default async function GaleriaPage() {
  const [images, videos] = await Promise.all([getGalleryImages(), getVideos()]);
  const hasAny = images.length + videos.length > 0;

  return (
    <>
      <Section className="pt-24 pb-8">
        <Container>
          <SectionHeading eyebrow="Multimedia" title="Galería" />
          {!hasAny && (
            <GlassCard className="mt-10 py-16 text-center text-muted-foreground">
              Todavía no hay contenido cargado.
            </GlassCard>
          )}
        </Container>
      </Section>

      {images.length > 0 && (
        <Section className="py-8">
          <Container>
            <h2 className="mb-6 font-display text-xl font-bold">Fotos</h2>
            <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
              {images.map((img) => (
                <figure key={img.id} className="break-inside-avoid overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url ?? ""}
                    alt={img.title ?? "Imagen de la galería"}
                    className="w-full object-cover"
                  />
                  {img.title && (
                    <figcaption className="px-1 pt-1.5 text-xs text-muted-foreground">{img.title}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {videos.length > 0 && (
        <Section className="py-8">
          <Container>
            <h2 className="mb-6 font-display text-xl font-bold">Videos</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((v) => (
                <Reveal key={v.id}>
                  <GlassCard className="space-y-3 p-3">
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                      <iframe
                        className="size-full"
                        src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                        title={v.title ?? "Video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    {v.title && <p className="px-1 font-display font-semibold">{v.title}</p>}
                    {v.caption && <p className="px-1 text-sm text-muted-foreground">{v.caption}</p>}
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
