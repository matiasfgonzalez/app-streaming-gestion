"use client";

import { MonitorDown, Share, Smartphone, SquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/glass/glass-card";
import { NeuButton } from "@/components/glass/neu-button";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { toast } from "@/components/ui";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Sección "instalá la app" (PWA). Se muestra solo cuando aplica:
 * - Chrome/Edge (desktop y Android): botón real vía `beforeinstallprompt`.
 * - iOS Safari: instrucciones (Compartir → Agregar a inicio), sin API de prompt.
 * - Ya instalada (display-mode standalone) o no soportado: no se renderiza nada.
 */
export function InstallApp({ brandName }: { brandName: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari expone `standalone` fuera del tipo Navigator estándar.
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Detección diferida: evita setState síncrono dentro del effect.
    const t = setTimeout(() => {
      if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        setIsIos(true);
        setHidden(false);
      }
    }, 0);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setHidden(false);
    };
    const onInstalled = () => {
      setHidden(true);
      toast.success("¡Listo! La app quedó instalada.");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      clearTimeout(t);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (hidden) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setHidden(true);
    setDeferred(null);
  }

  return (
    <Section id="instalar" className="py-12">
      <Container className="max-w-3xl">
        <Reveal>
          <GlassCard className="relative overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <span className="ring-glow inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Smartphone className="size-8" />
              </span>
              <div className="min-w-0 flex-1">
                <SectionHeading
                  eyebrow="App"
                  title={`Llevá ${brandName} con vos`}
                  className="mx-0 max-w-none text-center sm:text-left [&_h2]:text-2xl"
                />
                <p className="mt-2 text-sm text-pretty text-muted-foreground">
                  Instalala gratis en tu celular o computadora: se abre a pantalla completa,
                  directo desde tu inicio, sin pasar por el navegador.
                </p>

                {deferred ? (
                  <NeuButton onClick={install} className="mt-5">
                    <MonitorDown /> Instalar la app
                  </NeuButton>
                ) : isIos ? (
                  <ol className="mt-5 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center justify-center gap-2 sm:justify-start">
                      <Share className="size-4 shrink-0 text-primary" />
                      1 · Tocá <strong className="text-foreground">Compartir</strong> en Safari
                    </li>
                    <li className="flex items-center justify-center gap-2 sm:justify-start">
                      <SquarePlus className="size-4 shrink-0 text-primary" />
                      2 · Elegí <strong className="text-foreground">Agregar a inicio</strong>
                    </li>
                  </ol>
                ) : null}
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </Container>
    </Section>
  );
}
