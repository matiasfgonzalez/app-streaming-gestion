import { GlassCard } from "@/components/glass/glass-card";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section } from "@/components/glass/section";
import { STATS } from "@/lib/landing-data";

export function Stats() {
  return (
    <Section className="py-10">
      <Container>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <GlassCard className="text-center hover:-translate-y-1">
                <div className="font-display text-3xl font-bold text-primary tnum sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
