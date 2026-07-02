import { Check } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { requireRole } from "@/lib/auth";
import { getActivePackages } from "@/server/queries/ads";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Contratar publicidad" };

export default async function ContratarPage() {
  await requireRole();
  const packages = await getActivePackages();

  return (
    <Section className="pt-24">
      <Container>
        <SectionHeading
          eyebrow="Publicidad"
          title="Elegí tu paquete"
          subtitle="Seleccioná un plan para empezar. Después completás los datos y el pago."
        />
        {packages.length === 0 ? (
          <GlassCard className="mt-10 py-16 text-center text-muted-foreground">
            No hay paquetes disponibles por el momento.
          </GlassCard>
        ) : (
          <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
            {packages.map((p) => (
              <GlassCard key={p.id} className="flex h-full flex-col">
                <h3 className="font-display text-lg font-bold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="font-display text-3xl font-bold">{formatMoney(p.priceMonthly)}</span>
                  <span className="pb-1 text-sm text-muted-foreground">/mes</span>
                </div>
                <ul className="mt-4 flex-1 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/cliente/contratar/${p.id}`}
                  className={cn(neuButton(), "mt-6 w-full")}
                >
                  Elegir
                </Link>
              </GlassCard>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
