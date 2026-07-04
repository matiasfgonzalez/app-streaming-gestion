import { GlassCard } from "@/components/glass/glass-card";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { StreamPlayer } from "@/components/sections/stream-player";
import { DEFAULT_STREAMING } from "@/lib/radio";

// El stream (YouTube y/o Facebook) se configura desde /admin/radio/streaming.
export function Streaming({
  youtubeId = DEFAULT_STREAMING.youtubeId,
  facebookUrl,
  brandName = "Viva La Mañana",
}: {
  youtubeId?: string;
  facebookUrl?: string;
  brandName?: string;
}) {
  const both = !!youtubeId && !!facebookUrl;
  return (
    <Section id="streaming">
      <Container>
        <SectionHeading
          eyebrow="Ver streaming"
          title={
            both
              ? "Mirá el vivo donde quieras"
              : facebookUrl
                ? "Mirá el vivo por Facebook"
                : "Mirá el vivo por YouTube"
          }
          subtitle="Seguí las transmisiones en tiempo real, desde donde estés."
        />
        <Reveal className="mt-10">
          <GlassCard className="mx-auto max-w-4xl p-3">
            <StreamPlayer
              youtubeId={youtubeId}
              facebookUrl={facebookUrl}
              title={`Streaming ${brandName}`}
            />
          </GlassCard>
        </Reveal>
      </Container>
    </Section>
  );
}
