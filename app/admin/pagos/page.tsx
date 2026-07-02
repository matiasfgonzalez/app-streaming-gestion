import { CreditCard, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { PaymentReview } from "@/components/admin/payment-review";
import { requireRole } from "@/lib/auth";
import { getAllPayments } from "@/server/queries/ads";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/ads";
import { formatDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui";

export const metadata = { title: "Pagos" };

const STATUS_CLS: Record<string, string> = {
  APPROVED: "bg-primary/15 text-primary",
  PENDING: "bg-accent/15 text-accent",
  REJECTED: "bg-destructive/10 text-destructive",
};

export default async function AdminPaymentsPage() {
  await requireRole("ADMIN");
  const payments = await getAllPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Pagos</h1>
        <p className="text-sm text-muted-foreground">
          {payments.length} {payments.length === 1 ? "pago" : "pagos"}
        </p>
      </div>

      {payments.length === 0 ? (
        <GlassCard className="p-0">
          <EmptyState
            icon={CreditCard}
            title="Todavía no hay pagos informados"
            description="Cuando un cliente informe un pago, aparecerá acá para aprobar o rechazar."
          />
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <GlassCard key={p.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold">
                    {formatMoney(p.amount)}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      · {PAYMENT_METHOD_LABEL[p.method]}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {p.contract.title} · {p.contract.package?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.contract.client?.name ?? p.contract.client?.email ?? "Sin cliente"} ·{" "}
                    {formatDate(p.createdAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    STATUS_CLS[p.status],
                  )}
                >
                  {PAYMENT_STATUS_LABEL[p.status]}
                </span>
              </div>

              {p.notes && (
                <p className="rounded-xl bg-muted/50 px-4 py-2 text-sm">{p.notes}</p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                {p.proofUrl ? (
                  <a
                    href={p.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    <ExternalLink className="size-4" /> Ver comprobante
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Sin comprobante</span>
                )}
                {p.status === "PENDING" && <PaymentReview id={p.id} />}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
