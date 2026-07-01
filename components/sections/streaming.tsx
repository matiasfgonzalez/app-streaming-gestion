import { GlassCard } from "@/components/glass/glass-card";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";

// Fase 1: streaming = embed YouTube. En admin (Fase 7/8) será configurable.
const YT_ID = "jfKfPfyJRdk"; // stream demo (lofi)

export function Streaming() {
  return (
    <Section id="streaming">
      <Container>
        <SectionHeading
          eyebrow="Ver streaming"
          title="Mirá el vivo por YouTube"
          subtitle="Seguí las transmisiones del canal en tiempo real, desde donde estés."
        />
        <Reveal className="mt-10">
          <GlassCard className="mx-auto max-w-4xl p-3">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                className="size-full"
                src={`https://www.youtube-nocookie.com/embed/${YT_ID}`}
                title="Streaming Viva La Mañana"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </GlassCard>
        </Reveal>
      </Container>
    </Section>
  );
}
