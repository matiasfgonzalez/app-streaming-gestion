import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";
import { neuButton } from "@/components/glass/neu-button";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { NEWS } from "@/lib/landing-data";

export function LatestNews() {
  return (
    <Section id="noticias">
      <Container>
        <SectionHeading
          eyebrow="Enterate"
          title="Últimas noticias"
          subtitle="Lo que pasa en el programa, los eventos y el deporte de la ciudad."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {NEWS.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.08}>
              <GlassCard className="flex h-full flex-col gap-4 p-4 hover:-translate-y-1">
                <MediaPlaceholder hue={n.hue} icon={Newspaper} className="aspect-video">
                  <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium">
                    {n.category}
                  </span>
                </MediaPlaceholder>
                <div className="flex flex-1 flex-col">
                  <p className="text-xs text-muted-foreground">{n.date}</p>
                  <h3 className="mt-1 font-display font-semibold text-balance">
                    {n.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {n.excerpt}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Leer más <ArrowRight className="size-4" />
                  </span>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/noticias" className={neuButton({ variant: "outline" })}>
            Ver todas las noticias
          </Link>
        </div>
      </Container>
    </Section>
  );
}
