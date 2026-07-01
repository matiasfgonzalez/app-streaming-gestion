import { Plus } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { FAQS } from "@/lib/landing-data";

export function Faq() {
  return (
    <Section id="faq">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="¿Tenés dudas?"
          subtitle="Respondemos lo que más nos consultan."
        />
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <GlassCard className="p-0">
                <details className="group p-5 [&_summary]:list-none">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-display font-semibold">
                    {f.q}
                    <Plus className="size-5 shrink-0 text-primary transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
