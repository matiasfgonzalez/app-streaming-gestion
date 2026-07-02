import { ExternalLink, Handshake } from "lucide-react";
import Image from "next/image";
import { GlassCard } from "@/components/glass/glass-card";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { getActiveSponsors, bumpSponsorImpressions } from "@/server/queries/banners";

export const metadata = {
  title: "Sponsors",
  description: "Las marcas que confían en Viva La Mañana.",
};

export default async function SponsorsPage() {
  const sponsors = await getActiveSponsors();
  // Métrica simple de impresiones (no bloqueante).
  bumpSponsorImpressions().catch(() => {});

  return (
    <Section className="pt-24">
      <Container>
        <SectionHeading
          eyebrow="Confían en nosotros"
          title="Nuestros sponsors"
          subtitle="Marcas que acompañan a Viva La Mañana."
        />

        {sponsors.length === 0 ? (
          <GlassCard className="mt-10 py-16 text-center text-muted-foreground">
            Todavía no hay sponsors cargados.
          </GlassCard>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((s) => (
              <GlassCard key={s.id} className="flex flex-col items-center gap-4 text-center hover:-translate-y-1">
                <div className="flex h-20 items-center justify-center">
                  {s.logoUrl ? (
                    <div className="relative h-20 w-40">
                      <Image src={s.logoUrl} alt={s.name} fill className="object-contain" sizes="160px" />
                    </div>
                  ) : (
                    <Handshake className="size-10 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold">{s.name}</h3>
                  {s.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                  )}
                </div>
                {s.website && (
                  <a
                    href={`/api/track/sponsor/${s.id}`}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    <ExternalLink className="size-4" /> Visitar sitio
                  </a>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
