import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/glass/glass-card";
import { ContractStatusSelect } from "@/components/admin/contract-status-select";
import { PaymentReview } from "@/components/admin/payment-review";
import { requireRole } from "@/lib/auth";
import { getContractAdmin } from "@/server/queries/ads";
import {
  BILLING_CYCLE_LABEL,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
} from "@/lib/ads";
import { formatDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Detalle de contratación" };

const STATUS_CLS: Record<string, string> = {
  ACTIVE: "bg-primary/15 text-primary",
  APPROVED: "bg-primary/15 text-primary",
  PENDING: "bg-accent/15 text-accent",
  DRAFT: "bg-muted text-muted-foreground",
  REJECTED: "bg-destructive/10 text-destructive",
  EXPIRED: "bg-muted text-muted-foreground",
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export default async function AdminContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  const c = await getContractAdmin(id);
  if (!c) notFound();

  const logo = c.creatives.find((x) => x.type === "LOGO");
  const images = c.creatives.filter((x) => x.type === "IMAGE");

  return (
    <div className="space-y-6">
      <Link href="/admin/publicidad" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{c.title}</h1>
          <p className="text-sm text-muted-foreground">
            {c.package.name} · {BILLING_CYCLE_LABEL[c.billingCycle]}
          </p>
        </div>
        <ContractStatusSelect id={c.id} value={c.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <h2 className="mb-2 font-display font-semibold">Datos</h2>
          <Row label="Cliente" value={c.client?.name ?? c.client?.email ?? "Sin cliente (de palabra)"} />
          <Row label="Email" value={c.client?.email} />
          <Row label="Paquete" value={c.package.name} />
          <Row label="Ciclo" value={BILLING_CYCLE_LABEL[c.billingCycle]} />
          <Row label="Precio mensual" value={formatMoney(c.package.priceMonthly)} />
          <Row label="Creada" value={formatDate(c.createdAt)} />
          <Row label="Inicio vigencia" value={c.startDate ? formatDate(c.startDate) : null} />
          <Row label="Fin vigencia" value={c.endDate ? formatDate(c.endDate) : null} />
          <Row label="Redes" value={c.socials} />
          {c.description && (
            <p className="mt-3 rounded-xl bg-muted/50 px-4 py-3 text-sm">{c.description}</p>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 font-display font-semibold">Creatividades</h2>
          {c.creatives.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin creatividades cargadas.</p>
          ) : (
            <div className="space-y-3">
              {logo && (
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Logo</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.url} alt="Logo" className="size-24 rounded-lg object-contain" />
                </div>
              )}
              {images.length > 0 && (
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Imágenes</p>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((im) => (
                      <a key={im.id} href={im.url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={im.url} alt="Creatividad" className="aspect-square w-full rounded-lg object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>

      <div>
        <h2 className="mb-3 font-display font-semibold">Pagos</h2>
        {c.payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin pagos informados.</p>
        ) : (
          <div className="space-y-3">
            {c.payments.map((p) => (
              <GlassCard key={p.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm">
                    <span className="font-semibold">{formatMoney(p.amount)}</span> ·{" "}
                    {PAYMENT_METHOD_LABEL[p.method]} · {formatDate(p.createdAt)}
                  </p>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_CLS[p.status])}>
                    {PAYMENT_STATUS_LABEL[p.status]}
                  </span>
                </div>
                {p.notes && <p className="text-sm text-muted-foreground">{p.notes}</p>}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {p.proofUrl ? (
                    <a href={p.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary">
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
    </div>
  );
}
