import { Trophy, Radio, Play } from "lucide-react";
import Link from "next/link";
import { MediaPlaceholder } from "@/components/glass/media-placeholder";
import { neuButton } from "@/components/glass/neu-button";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section } from "@/components/glass/section";

export function Sports() {
  return (
    <Section id="deportes">
      <Container>
        <div className="glass relative overflow-hidden rounded-2xl p-6 sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <Reveal>
              <span className="text-eyebrow mb-3 inline-flex items-center gap-2 text-accent">
                <Trophy className="size-4" /> Cobertura deportiva
              </span>
              <h2 className="font-display text-3xl font-bold text-balance sm:text-4xl">
                Vivamos el fútbol como se merece
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground">
                Relato en vivo, entrevistas y análisis de cada partido. Sumá tu
                marca como sponsor de las transmisiones deportivas.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="#streaming" className={neuButton()}>
                  <Play /> Ver transmisión
                </Link>
                <Link
                  href="/#publicidad"
                  className={neuButton({ variant: "glass" })}
                >
                  <Radio /> Sponsorear fútbol
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <MediaPlaceholder
                hue={300}
                icon={Trophy}
                className="aspect-video w-full"
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
