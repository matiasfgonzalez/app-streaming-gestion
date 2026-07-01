"use client";

import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { Container, Section, SectionHeading } from "@/components/glass/section";

const inputCls =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring";

export function ContactMap() {
  // Fase 1: sin persistencia. El envío real (ContactMessage + email) llega en Fase 4/8.
  const [sent, setSent] = useState(false);

  return (
    <Section id="contacto">
      <Container>
        <SectionHeading
          eyebrow="Contacto"
          title="Hablemos"
          subtitle="Escribinos para publicidad, coberturas o lo que necesites."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <GlassCard className="p-6">
            {sent ? (
              <div className="flex h-full min-h-52 flex-col items-center justify-center text-center">
                <CheckCircle2 className="size-12 text-primary" />
                <p className="mt-3 font-display text-lg font-semibold">
                  ¡Mensaje enviado!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Te vamos a responder a la brevedad.
                </p>
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className={inputCls} placeholder="Nombre" required />
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <input className={inputCls} placeholder="Asunto" />
                <textarea
                  className={inputCls}
                  rows={4}
                  placeholder="Tu mensaje"
                  required
                />
                <button type="submit" className={neuButton() + " w-full"}>
                  <Send /> Enviar mensaje
                </button>
              </form>
            )}
          </GlassCard>

          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-1">
              <GlassCard className="flex items-center gap-3">
                <Mail className="size-5 text-primary" />
                <span className="text-sm">contacto@vivalamanana.com</span>
              </GlassCard>
              <GlassCard className="flex items-center gap-3">
                <Phone className="size-5 text-primary" />
                <span className="text-sm">+54 000 000 0000</span>
              </GlassCard>
              <GlassCard className="flex items-center gap-3">
                <MapPin className="size-5 text-primary" />
                <span className="text-sm">Av. Siempre Viva 123, Ciudad</span>
              </GlassCard>
            </div>
            <div
              className="relative flex-1 overflow-hidden rounded-xl border border-border"
              style={{
                minHeight: "180px",
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.6 0.05 250 / 0.4), oklch(0.5 0.08 300 / 0.4))",
              }}
            >
              <span className="glass absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm">
                <MapPin className="size-4 text-primary" /> Google Maps (próximamente)
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
