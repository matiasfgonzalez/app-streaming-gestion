import { Radio, Play, Sparkles, Dot } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/glass/aurora-background";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { Container, Section } from "@/components/glass/section";
import { Waveform } from "@/components/glass/waveform";

export function Hero() {
  return (
    <Section className="overflow-hidden pt-14 sm:pt-20">
      <AuroraBackground />
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
            <Sparkles className="size-4 text-accent" />
            Nueva temporada al aire
          </span>
          <h1 className="font-display text-4xl font-bold text-balance sm:text-6xl">
            En vivo cada{" "}
            <span className="text-primary text-glow">mañana</span>, con vos
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-muted-foreground sm:text-lg">
            Radio, streaming, cobertura de eventos y publicidad. Viva La Mañana:
            todo el programa en un solo lugar.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/radio" className={neuButton({ size: "lg" })}>
              <Radio /> Escuchar radio
            </Link>
            <Link
              href="#streaming"
              className={neuButton({ variant: "glass", size: "lg" })}
            >
              <Play /> Ver streaming
            </Link>
          </div>
        </div>

        {/* Mini "sonando ahora" */}
        <GlassCard className="relative mx-auto w-full max-w-md p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
            Al aire ahora
          </div>
          <div className="flex items-center gap-4">
            <span className="ring-glow inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Radio className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display font-semibold">
                Viva La Mañana
              </p>
              <p className="truncate text-sm text-muted-foreground">
                Programa en vivo · 8 a 11 hs
              </p>
            </div>
          </div>
          <div className="mt-5 text-primary">
            <Waveform />
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
            <Dot className="size-4 text-primary" /> Transmitiendo en HD
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
}
