import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { getGalleryImages } from "@/server/queries/media";

// Mosaico bento: algunos ítems ocupan más espacio (fallback sin datos).
const FALLBACK = [
  { hue: 40, span: "col-span-2 row-span-2" },
  { hue: 300, span: "" },
  { hue: 200, span: "" },
  { hue: 120, span: "" },
  { hue: 260, span: "" },
  { hue: 20, span: "col-span-2" },
];

const SPANS = ["col-span-2 row-span-2", "", "", "", "", "col-span-2"];

export async function Gallery() {
  const images = await getGalleryImages(6);

  return (
    <Section id="galeria">
      <Container>
        <SectionHeading
          eyebrow="Galería"
          title="Momentos del programa"
          subtitle="Detrás de escena, eventos y transmisiones en imágenes."
        />
        <Reveal className="mt-10">
          <div className="grid auto-rows-[120px] grid-cols-2 gap-3 sm:auto-rows-[150px] sm:grid-cols-4">
            {images.length > 0
              ? images.map((img, i) => (
                  <div
                    key={img.id}
                    className={`relative overflow-hidden rounded-xl ${SPANS[i] ?? ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url ?? ""}
                      alt={img.title ?? "Imagen de la galería"}
                      className="size-full object-cover"
                    />
                  </div>
                ))
              : FALLBACK.map((it, i) => (
                  <MediaPlaceholder key={i} hue={it.hue} icon={ImageIcon} className={it.span} />
                ))}
          </div>
        </Reveal>
        {images.length > 0 && (
          <div className="mt-6 text-center">
            <Link href="/galeria" className="text-sm font-medium text-primary hover:underline">
              Ver galería completa
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
