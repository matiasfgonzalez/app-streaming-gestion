import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";
import { neuButton } from "@/components/glass/neu-button";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { EVENTS } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  "En vivo": "bg-primary text-primary-foreground",
  Próximamente: "glass text-foreground",
  Finalizado: "bg-muted text-muted-foreground",
};

export function UpcomingEvents() {
  return (
    <Section id="eventos">
      <Container>
        <SectionHeading
          eyebrow="Agenda"
          title="Próximos eventos"
          subtitle="Dónde vamos a estar. ¿Tenés un evento? Pedí tu presupuesto de cobertura."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {EVENTS.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08}>
              <GlassCard className="flex h-full flex-col gap-4 p-4 hover:-translate-y-1">
                <MediaPlaceholder hue={e.hue} icon={CalendarDays} className="aspect-[4/3]">
                  <span
                    className={cn(
                      "absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium",
                      STATUS_STYLE[e.status],
                    )}
                  >
                    {e.status}
                  </span>
                </MediaPlaceholder>
                <div className="flex flex-1 flex-col">
                  <h3 className="font-display font-semibold">{e.name}</h3>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4" /> {e.venue}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" /> {e.date}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/eventos" className={neuButton({ variant: "outline" })}>
            Ver agenda completa
          </Link>
          <Link href="/eventos#presupuesto" className={neuButton()}>
            Solicitar presupuesto
          </Link>
        </div>
      </Container>
    </Section>
  );
}
