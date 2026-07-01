import Link from "next/link";
import { neuButton } from "@/components/glass/neu-button";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { EventCard, type CardEvent } from "@/components/events/event-card";
import { EVENTS } from "@/lib/landing-data";
import { formatDateTime, hueFrom } from "@/lib/format";
import { getUpcomingEvents } from "@/server/queries/events";

export async function UpcomingEvents() {
  const dbEvents = await getUpcomingEvents(3);

  const items: CardEvent[] =
    dbEvents.length > 0
      ? dbEvents.map((e) => ({
          slug: e.slug,
          name: e.name,
          venue: e.venue,
          dateLabel: formatDateTime(e.startsAt),
          status: e.status,
          coverUrl: e.coverUrl,
          hue: hueFrom(e.slug),
        }))
      : EVENTS.map((e) => ({
          name: e.name,
          venue: e.venue,
          dateLabel: e.date,
          status:
            e.status === "En vivo"
              ? "LIVE"
              : e.status === "Finalizado"
                ? "FINISHED"
                : "UPCOMING",
          hue: e.hue,
        }));

  return (
    <Section id="eventos">
      <Container>
        <SectionHeading
          eyebrow="Agenda"
          title="Próximos eventos"
          subtitle="Dónde vamos a estar. ¿Tenés un evento? Pedí tu presupuesto de cobertura."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((e, i) => (
            <Reveal key={e.slug ?? e.name} delay={i * 0.08}>
              <EventCard event={e} />
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
