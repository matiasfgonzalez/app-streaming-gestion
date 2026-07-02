import { GlassCard } from "@/components/glass/glass-card";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { GalleryWall, type GalleryItem } from "@/components/gallery/gallery-wall";
import { getGalleryImages, getVideos } from "@/server/queries/media";
import { getSiteConfig } from "@/server/queries/settings";
import { ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/ui";

export async function generateMetadata() {
  const site = await getSiteConfig();
  return {
    title: "Galería",
    description: `Fotos y videos de ${site.brandName}: eventos, coberturas y detrás de escena.`,
  };
}

export default async function GaleriaPage() {
  const [images, videos] = await Promise.all([getGalleryImages(), getVideos()]);

  // Muro unificado: destacados primero, después cronológico mezclando tipos.
  const items: GalleryItem[] = [...images, ...videos]
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .map((m) => ({
      id: m.id,
      type: m.type,
      title: m.title,
      caption: m.caption,
      url: m.url,
      youtubeId: m.youtubeId,
      featured: m.featured,
    }));

  return (
    <Section className="pt-24">
      <Container>
        <SectionHeading
          eyebrow="Multimedia"
          title="Galería"
          subtitle="Eventos, coberturas y detrás de escena, en fotos y videos."
        />

        {items.length === 0 ? (
          <GlassCard className="mt-10 p-0">
            <EmptyState
              icon={ImageIcon}
              title="Todavía no hay contenido"
              description="Estamos subiendo fotos y videos. Volvé pronto."
            />
          </GlassCard>
        ) : (
          <div className="mt-10">
            <GalleryWall items={items} />
          </div>
        )}
      </Container>
    </Section>
  );
}
