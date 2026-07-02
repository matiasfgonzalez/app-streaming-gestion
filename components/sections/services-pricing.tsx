import { Check } from "lucide-react";
import Link from "next/link";
import { neuButton } from "@/components/glass/neu-button";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { PLANS, SERVICES } from "@/lib/landing-data";
import { formatMoney } from "@/lib/format";
import { getActivePackages } from "@/server/queries/ads";
import { cn } from "@/lib/utils";

type PlanCard = {
  id?: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
};

export async function ServicesPricing() {
  const dbPackages = await getActivePackages();

  let plans: PlanCard[];
  if (dbPackages.length > 0) {
    const maxPrice = Math.max(...dbPackages.map((p) => p.priceMonthly));
    plans = dbPackages.map((p) => ({
      id: p.id,
      name: p.name,
      price: formatMoney(p.priceMonthly),
      period: "/mes",
      description: p.description,
      features: p.features,
      featured: p.priceMonthly === maxPrice,
    }));
  } else {
    plans = PLANS.map((p) => ({
      name: p.name,
      price: p.price,
      period: p.period,
      description: p.description,
      features: p.features,
      featured: !!p.featured,
    }));
  }

  return (
    <Section id="publicidad">
      <Container>
        <SectionHeading
          eyebrow="Publicidad y servicios"
          title="Sumá tu marca al programa"
          subtitle="Elegí el paquete de sponsoreo que mejor se adapte. Precios mensuales; también semanal o por día."
        />

        {/* Servicios */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SERVICES.map(({ title, description, icon: Icon }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              {/* surface plano: los paquetes (glass + glow) quedan un nivel arriba */}
              <div className="surface h-full rounded-xl p-4 transition-transform duration-300 hover:-translate-y-1">
                <span className="mb-2 inline-flex size-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Paquetes */}
        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.id ?? p.name} delay={i * 0.08} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl p-6",
                  p.featured
                    ? "ring-glow bg-primary text-primary-foreground lg:-translate-y-3"
                    : "glass",
                )}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary shadow">
                    Más elegido
                  </span>
                )}
                <h3 className="font-display text-lg font-bold">{p.name}</h3>
                <p className={cn("mt-1 text-sm", p.featured ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {p.description}
                </p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="font-display text-4xl font-bold">{p.price}</span>
                  <span className={cn("pb-1 text-sm", p.featured ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {p.period}
                  </span>
                </div>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.id ? `/cliente/contratar/${p.id}` : "/cliente/contratar"}
                  className={cn(neuButton({ variant: p.featured ? "glass" : "primary" }), "mt-6 w-full")}
                >
                  Contratar
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
