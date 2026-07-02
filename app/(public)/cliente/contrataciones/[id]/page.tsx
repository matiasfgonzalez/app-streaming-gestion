import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/glass/glass-card";
import { Container, Section } from "@/components/glass/section";
import { PaymentForm } from "@/components/client/payment-form";
import { requireRole } from "@/lib/auth";
import { getContractForClient } from "@/server/queries/ads";
import {
  BILLING_CYCLE_LABEL,
  CONTRACT_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  priceForCycle,
} from "@/lib/ads";
import { formatDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Contratación" };

const STATUS_CLS: Record<string, string> = {
  ACTIVE: "bg-primary/15 text-primary",
  APPROVED: "bg-primary/15 text-primary",
  PENDING: "bg-accent/15 text-accent",
  DRAFT: "bg-muted text-muted-foreground",
  REJECTED: "bg-destructive/10 text-destructive",
  EXPIRED: "bg-muted text-muted-foreground",
};

export default async function ContratacionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole();
  const { id } = await params;
  const contract = await getContractForClient(id, user.id);
  if (!contract) notFound();

  const amount = priceForCycle(contract.package, contract.billingCycle);
  const hasApproved = contract.payments.some((p) => p.status === "APPROVED");

  return (
    <Section className="pt-24">
      <Container className="max-w-3xl">
        <Link href="/cliente" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">{contract.title}</h1>
            <p className="text-sm text-muted-foreground">
              {contract.package.name} · {BILLING_CYCLE_LABEL[contract.billingCycle]}
            </p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-medium", STATUS_CLS[contract.status])}>
            {CONTRACT_STATUS_LABEL[contract.status]}
          </span>
        </div>

        {contract.description && (
          <GlassCard className="mt-6">
            <p className="text-sm">{contract.description}</p>
            {contract.socials && (
              <p className="mt-2 text-sm text-muted-foreground">Redes: {contract.socials}</p>
            )}
          </GlassCard>
        )}

        {contract.creatives.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 font-display font-semibold">Creatividades</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {contract.creatives.map((cr) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={cr.id}
                  src={cr.url}
                  alt={cr.alt ?? "Creatividad"}
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagos */}
        <div className="mt-8">
          <h2 className="mb-3 font-display font-semibold">Pagos</h2>
          {contract.payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavía no informaste ningún pago.</p>
          ) : (
            <div className="space-y-2">
              {contract.payments.map((p) => (
                <GlassCard key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="text-sm">
                    <span className="font-semibold">{formatMoney(p.amount)}</span> ·{" "}
                    {PAYMENT_METHOD_LABEL[p.method]} · {formatDate(p.createdAt)}
                    {p.proofUrl && (
                      <a href={p.proofUrl} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-primary">
                        <ExternalLink className="size-3.5" /> comprobante
                      </a>
                    )}
                  </div>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CLS[p.status])}>
                    {PAYMENT_STATUS_LABEL[p.status]}
                  </span>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Informar pago */}
        {!hasApproved && (
          <div className="mt-8">
            <h2 className="mb-3 font-display font-semibold">Informar un pago</h2>
            <PaymentForm contractId={contract.id} defaultAmount={amount} />
          </div>
        )}
      </Container>
    </Section>
  );
}
