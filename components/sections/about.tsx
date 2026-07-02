import { Radio, Users, CalendarDays, Megaphone } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";

const PILLARS = [
  { icon: Radio, title: "Radio en vivo", text: "De lunes a viernes, 8 a 11 hs." },
  { icon: CalendarDays, title: "Eventos", text: "Cobertura y producción integral." },
  { icon: Megaphone, title: "Publicidad", text: "Sponsors en radio y streaming." },
  { icon: Users, title: "Comunidad", text: "Miles de oyentes cada día." },
];

export function About({ brandName = "Viva La Mañana" }: { brandName?: string }) {
  return (
    <Section id="quienes-somos">
      <Container>
        <SectionHeading
          eyebrow={`Qué es ${brandName}`}
          title="Un medio, muchas voces"
          subtitle="Nucleamos la radio, el streaming, la cobertura de eventos y la publicidad de todo el programa en una sola plataforma."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <GlassCard className="h-full hover:-translate-y-1">
                <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-display font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
