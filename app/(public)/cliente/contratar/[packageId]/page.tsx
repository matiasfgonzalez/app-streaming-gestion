import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/glass/glass-card";
import { Container, Section } from "@/components/glass/section";
import { ClientContractForm } from "@/components/client/contract-form";
import { requireRole } from "@/lib/auth";
import { getPackageById } from "@/server/queries/ads";
import { formatMoney } from "@/lib/format";

export const metadata = { title: "Contratar" };

export default async function ContratarPaquetePage({
  params,
}: {
  params: Promise<{ packageId: string }>;
}) {
  await requireRole();
  const { packageId } = await params;
  const pkg = await getPackageById(packageId);
  if (!pkg || !pkg.active) notFound();

  return (
    <Section className="pt-24">
      <Container className="max-w-3xl">
        <Link href="/cliente/contratar" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver
        </Link>
        <h1 className="mt-4 font-display text-2xl font-bold">Contratar: {pkg.name}</h1>
        <GlassCard className="mt-4">
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
          <p className="mt-2 font-display text-xl font-bold">
            {formatMoney(pkg.priceMonthly)}<span className="text-sm font-normal text-muted-foreground">/mes</span>
          </p>
        </GlassCard>
        <p className="mt-6 mb-4 text-sm text-muted-foreground">
          Completá los datos de tu publicidad. Al enviar, queda pendiente y luego
          informás el pago para que lo aprobemos.
        </p>
        <ClientContractForm packageId={pkg.id} />
      </Container>
    </Section>
  );
}
