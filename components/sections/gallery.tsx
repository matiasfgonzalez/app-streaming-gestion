import { ImageIcon } from "lucide-react";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";

// Mosaico: algunos ítems ocupan más espacio (bento).
const ITEMS = [
  { hue: 40, span: "col-span-2 row-span-2" },
  { hue: 300, span: "" },
  { hue: 200, span: "" },
  { hue: 120, span: "" },
  { hue: 260, span: "" },
  { hue: 20, span: "col-span-2" },
];

export function Gallery() {
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
            {ITEMS.map((it, i) => (
              <MediaPlaceholder
                key={i}
                hue={it.hue}
                icon={ImageIcon}
                className={it.span}
              />
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
