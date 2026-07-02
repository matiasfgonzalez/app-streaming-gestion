import { Home, Newspaper, Radio } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/glass/aurora-background";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";

export const metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden p-6">
      <AuroraBackground />
      <GlassCard className="w-full max-w-md p-8 text-center">
        <p className="text-glow font-display text-7xl font-bold text-primary tabular-nums">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold">Esta página no existe</h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          El enlace no existe o el contenido se movió. Seguí por acá:
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className={neuButton()}>
            <Home /> Inicio
          </Link>
          <Link href="/noticias" className={neuButton({ variant: "glass" })}>
            <Newspaper /> Noticias
          </Link>
          <Link href="/radio" className={neuButton({ variant: "glass" })}>
            <Radio /> Radio
          </Link>
        </div>
      </GlassCard>
    </main>
  );
}
