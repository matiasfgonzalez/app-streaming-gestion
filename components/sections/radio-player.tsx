"use client";

import { Pause, Play, Radio, Volume2 } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/glass/glass-card";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { Waveform } from "@/components/glass/waveform";
import { cn } from "@/lib/utils";

/**
 * Reproductor placeholder (Fase 1). No hay audio real todavía; el play/pause
 * es visual. La radio propia embebida llega en Fase 7 / backlog.
 */
export function RadioPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <Section id="radio">
      <Container>
        <SectionHeading
          eyebrow="Escuchar radio"
          title="Sintonizá el vivo"
          subtitle="Dale play y acompañanos cada mañana. Muy pronto, la radio directamente desde el sitio."
        />
        <Reveal className="mt-10">
          <GlassCard className="mx-auto flex max-w-2xl flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pausar" : "Reproducir"}
              className={cn(
                "ring-glow inline-flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95",
              )}
            >
              {playing ? (
                <Pause className="size-8" />
              ) : (
                <Play className="size-8 translate-x-0.5" />
              )}
            </button>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 text-sm text-primary sm:justify-start">
                <Radio className="size-4" /> Viva La Mañana FM
              </div>
              <p className="mt-1 font-display text-lg font-semibold">
                {playing ? "Al aire · en vivo" : "En pausa"}
              </p>
              <div
                className={cn(
                  "mt-3 text-primary transition-opacity",
                  playing ? "opacity-100" : "opacity-40",
                )}
              >
                <Waveform />
              </div>
            </div>

            <Volume2 className="hidden size-5 text-muted-foreground sm:block" />
          </GlassCard>
        </Reveal>
      </Container>
    </Section>
  );
}
