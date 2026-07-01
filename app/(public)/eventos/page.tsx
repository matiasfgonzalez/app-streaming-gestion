import type { Event } from "@prisma/client";
import { GlassCard } from "@/components/glass/glass-card";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { EventCard, type CardEvent } from "@/components/events/event-card";
import { QuoteForm } from "@/components/events/quote-form";
import { getPublicEvents, getEventOptions } from "@/server/queries/events";
import { formatDateTime, hueFrom } from "@/lib/format";

export const metadata = {
  title: "Eventos",
  description: "Agenda de eventos y coberturas de Viva La Mañana.",
};

function toCard(e: Event): CardEvent {
  return {
    slug: e.slug,
    name: e.name,
    venue: e.venue,
    dateLabel: formatDateTime(e.startsAt),
    status: e.status,
    coverUrl: e.coverUrl,
    hue: hueFrom(e.slug),
  };
}

export default async function EventosPage() {
  const [{ live, upcoming, finished }, eventOptions] = await Promise.all([
    getPublicEvents(),
    getEventOptions(),
  ]);

  const hasAny = live.length + upcoming.length + finished.length > 0;

  return (
    <>
      <Section className="pt-24 pb-8">
        <Container>
          <SectionHeading eyebrow="Agenda" title="Eventos" />
          {!hasAny && (
            <GlassCard className="mt-10 py-16 text-center text-muted-foreground">
              Todavía no hay eventos cargados.
            </GlassCard>
          )}
        </Container>
      </Section>

      {live.length > 0 && (
        <Section className="py-8">
          <Container>
            <h2 className="mb-6 font-display text-xl font-bold">En vivo</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((e) => <EventCard key={e.id} event={toCard(e)} />)}
            </div>
          </Container>
        </Section>
      )}

      {upcoming.length > 0 && (
        <Section className="py-8">
          <Container>
            <h2 className="mb-6 font-display text-xl font-bold">Próximos</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => <EventCard key={e.id} event={toCard(e)} />)}
            </div>
          </Container>
        </Section>
      )}

      {finished.length > 0 && (
        <Section className="py-8">
          <Container>
            <h2 className="mb-6 font-display text-xl font-bold">Finalizados</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {finished.map((e) => <EventCard key={e.id} event={toCard(e)} />)}
            </div>
          </Container>
        </Section>
      )}

      <Section id="presupuesto">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="¿Tenés un evento?"
            title="Solicitá tu presupuesto"
            subtitle="Elegí los servicios que necesitás y contanos los detalles. Te respondemos a la brevedad."
          />
          <div className="mt-10">
            <QuoteForm events={eventOptions} />
          </div>
        </Container>
      </Section>
    </>
  );
}
