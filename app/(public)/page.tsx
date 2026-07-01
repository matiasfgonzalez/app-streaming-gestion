import { Radio, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/glass/aurora-background";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/glass/section";
import { cn } from "@/lib/utils";

// Fase 0 — showcase de las fundaciones. La landing real se construye en Fase 1.
const STATS = [
  { value: "+500", label: "Eventos" },
  { value: "+300", label: "Clientes" },
  { value: "+1500", label: "Noticias" },
  { value: "+200", label: "Transmisiones" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-20">
        <AuroraBackground />
        <Container className="flex flex-col items-center text-center">
          <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
            <Sparkles className="size-4 text-accent" />
            Radio · Streaming · Eventos
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-bold text-balance sm:text-6xl">
            Viva La <span className="text-primary text-glow">Mañana</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-muted-foreground sm:text-lg">
            Todo el programa en un solo lugar: escuchá la radio, mirá el
            streaming, seguí las noticias y contratá tu publicidad.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/radio" className={neuButton({ size: "lg" })}>
              <Radio /> Escuchar radio
            </Link>
            <Link
              href="/eventos"
              className={neuButton({ variant: "glass", size: "lg" })}
            >
              <Play /> Ver streaming
            </Link>
          </div>
        </Container>
      </Section>

      {/* Stats */}
      <Section className="py-8">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <GlassCard key={s.label} className="text-center hover:-translate-y-1">
                <div className="font-display text-3xl font-bold text-primary">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {s.label}
                </div>
              </GlassCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* Design system preview */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Fundaciones"
            title="Sistema de diseño listo"
            subtitle="Glassmorphism, neumorphism, aurora y modo claro/oscuro. Base mobile-first para construir la plataforma."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <GlassCard className="hover:-translate-y-1">
              <h3 className="font-display font-semibold">Glass</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Superficies translúcidas con blur y bordes sutiles.
              </p>
            </GlassCard>
            <div className="neu rounded-xl p-5">
              <h3 className="font-display font-semibold">Neumorphism</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sombras suaves para una sensación táctil.
              </p>
            </div>
            <div className="glass ring-glow rounded-xl p-5">
              <h3 className="font-display font-semibold text-glow">
                Glow cyberpunk
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Acentos de neón, usados con moderación.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className={neuButton({ variant: "primary" })}>Primario</button>
            <button className={neuButton({ variant: "secondary" })}>Secundario</button>
            <button className={neuButton({ variant: "neu" })}>Neu</button>
            <button className={neuButton({ variant: "glass" })}>Glass</button>
            <button className={neuButton({ variant: "outline" })}>Outline</button>
            <button className={cn(neuButton({ variant: "ghost" }))}>Ghost</button>
          </div>
        </Container>
      </Section>
    </>
  );
}
