"use client";

import { AlertTriangle, Home, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { AuroraBackground } from "@/components/glass/aurora-background";
import { GlassCard } from "@/components/glass/glass-card";
import { NeuButton, neuButton } from "@/components/glass/neu-button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden p-6">
      <AuroraBackground />
      <GlassCard className="w-full max-w-md p-8 text-center">
        <span className="ring-glow mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
          <AlertTriangle className="size-7" />
        </span>
        <h1 className="font-display text-2xl font-bold">No se pudo cargar esta sección</h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          Hubo un problema al mostrar el contenido. Probá de nuevo; si sigue, volvé al inicio.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground/70">ref: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <NeuButton onClick={reset}>
            <RotateCw /> Reintentar
          </NeuButton>
          <Link href="/" className={neuButton({ variant: "glass" })}>
            <Home /> Ir al inicio
          </Link>
        </div>
      </GlassCard>
    </main>
  );
}
