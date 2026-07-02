import { Radio, Play, Sparkles, Dot } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/glass/aurora-background";
import { FadeUp } from "@/components/glass/fade-up";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { Container, Section } from "@/components/glass/section";
import { Waveform } from "@/components/glass/waveform";
import type { SiteConfig } from "@/lib/site-config";

/** Hero de la landing: identidad configurable (nombre, eslogan, portada). */
export function Hero({ site }: { site: SiteConfig }) {
  // Última palabra del nombre en primario ("Viva La" + "Mañana").
  const words = site.brandName.trim().split(" ");
  const last = words.pop();
  const lead = words.join(" ");

  return (
    <Section className="overflow-hidden pt-14 sm:pt-20">
      <AuroraBackground />
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <FadeUp>
            <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
              <Sparkles className="size-4 text-accent" />
              {site.tagline || "Nueva temporada al aire"}
            </span>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="font-display text-4xl font-bold text-balance sm:text-6xl">
              {lead ? `${lead} ` : ""}
              <span className="text-primary text-glow">{last}</span>, con vos
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-5 max-w-xl text-pretty text-muted-foreground sm:text-lg">
              {site.description}
            </p>
          </FadeUp>

          <FadeUp delay={0.24}>
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
          </FadeUp>
        </div>

        {/* Portada + "sonando ahora" */}
        <FadeUp delay={0.14} className="mx-auto w-full max-w-md">
          <GlassCard className="relative w-full p-6">
            {site.coverUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={site.coverUrl}
                alt={`Portada de ${site.brandName}`}
                className="mb-5 aspect-video w-full rounded-xl object-cover"
              />
            )}
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
              Al aire ahora
            </div>
            <div className="flex items-center gap-4">
              {site.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={site.logoUrl}
                  alt={site.brandName}
                  className="ring-glow size-14 shrink-0 rounded-full object-contain"
                />
              ) : (
                <span className="ring-glow inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Radio className="size-6" />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-display font-semibold">{site.brandName}</p>
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
        </FadeUp>
      </Container>
    </Section>
  );
}
