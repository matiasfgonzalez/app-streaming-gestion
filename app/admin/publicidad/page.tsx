import { Megaphone, Plus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { ContractStatusSelect } from "@/components/admin/contract-status-select";
import { requireRole } from "@/lib/auth";
import { getAllContractsAdmin } from "@/server/queries/ads";
import { BILLING_CYCLE_LABEL } from "@/lib/ads";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui";

export const metadata = { title: "Publicidad" };

export default async function AdminAdsPage() {
  await requireRole("ADMIN");
  const contracts = await getAllContractsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Publicidad</h1>
          <p className="text-sm text-muted-foreground">
            {contracts.length} {contracts.length === 1 ? "contratación" : "contrataciones"}
          </p>
        </div>
        <Link href="/admin/publicidad/nueva" className={neuButton()}>
          <Plus /> Crear (sin cliente)
        </Link>
      </div>

      {contracts.length === 0 ? (
        <GlassCard className="p-0">
          <EmptyState
            icon={Megaphone}
            title="Todavía no hay contrataciones"
            description="Cuando un cliente contrate un paquete, o cargues una de palabra, aparecerá acá."
            action={
              <Link href="/admin/publicidad/nueva" className={neuButton()}>
                <Plus /> Nueva contratación
              </Link>
            }
          />
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {contracts.map((c) => {
            const paid = c.payments.some((p) => p.status === "APPROVED");
            return (
              <GlassCard key={c.id} className="flex flex-wrap items-start justify-between gap-3">
                <Link href={`/admin/publicidad/${c.id}`} className="min-w-0 flex-1">
                  <p className="font-display font-semibold hover:text-primary">{c.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.package.name} · {BILLING_CYCLE_LABEL[c.billingCycle]} ·{" "}
                    {c.client?.name ?? c.client?.email ?? "Sin cliente (de palabra)"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(c.createdAt)} · {c.payments.length} pago(s) ·{" "}
                    {paid ? "pago aprobado" : "sin pago aprobado"}
                    {c.status === "ACTIVE" && c.endDate
                      ? ` · vigente hasta ${formatDate(c.endDate)}`
                      : ""}
                  </p>
                </Link>
                <ContractStatusSelect id={c.id} value={c.status} />
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
