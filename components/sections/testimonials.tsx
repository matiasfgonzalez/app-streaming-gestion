import { Quote } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { TESTIMONIALS } from "@/lib/landing-data";

export function Testimonials({ brandName = "Viva La Mañana" }: { brandName?: string }) {
  return (
    <Section id="testimonios">
      <Container>
        <SectionHeading
          eyebrow="Testimonios"
          title="Clientes que confían"
          subtitle={`Lo que dicen las marcas que ya son parte de ${brandName}.`}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <GlassCard className="flex h-full flex-col p-6">
                <Quote className="size-7 text-primary" />
                <p className="mt-3 flex-1 text-pretty text-sm">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    className="inline-flex size-10 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                    style={{ background: `oklch(0.62 0.17 ${t.hue})` }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
