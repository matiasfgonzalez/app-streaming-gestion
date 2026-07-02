import { Plus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { Container, Section } from "@/components/glass/section";
import { requireRole } from "@/lib/auth";
import { getClientContracts } from "@/server/queries/ads";
import { CONTRACT_STATUS_LABEL } from "@/lib/ads";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Mi cuenta" };

const STATUS_CLS: Record<string, string> = {
  ACTIVE: "bg-primary/15 text-primary",
  PENDING: "bg-accent/15 text-accent",
  DRAFT: "bg-muted text-muted-foreground",
  REJECTED: "bg-destructive/10 text-destructive",
  EXPIRED: "bg-muted text-muted-foreground",
};

export default async function ClienteDashboard() {
  const user = await requireRole();
  const contracts = await getClientContracts(user.id);

  return (
    <Section className="pt-24">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">Mis contrataciones</h1>
            <p className="text-sm text-muted-foreground">Hola, {user.name ?? "cliente"}.</p>
          </div>
          <Link href="/cliente/contratar" className={neuButton()}>
            <Plus /> Contratar
          </Link>
        </div>

        {contracts.length === 0 ? (
          <GlassCard className="mt-10 py-16 text-center text-muted-foreground">
            Todavía no contrataste publicidad.{" "}
            <Link href="/cliente/contratar" className="text-primary underline">
              Elegí un paquete
            </Link>
            .
          </GlassCard>
        ) : (
          <div className="mt-10 grid gap-4">
            {contracts.map((c) => {
              const lastPayment = c.payments[0];
              return (
                <Link key={c.id} href={`/cliente/contrataciones/${c.id}`}>
                  <GlassCard className="flex flex-wrap items-center justify-between gap-3 hover:-translate-y-0.5">
                    <div>
                      <p className="font-display font-semibold">{c.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {c.package.name} · {formatDate(c.createdAt)}
                      </p>
                      {lastPayment && (
                        <p className="text-xs text-muted-foreground">
                          Último pago: {lastPayment.status}
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        STATUS_CLS[c.status],
                      )}
                    >
                      {CONTRACT_STATUS_LABEL[c.status]}
                    </span>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
