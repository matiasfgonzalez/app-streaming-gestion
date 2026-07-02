import { ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { requireRole } from "@/lib/auth";
import { getAuditLogs } from "@/server/queries/analytics";
import { formatDateTime } from "@/lib/format";
import { Badge, EmptyState } from "@/components/ui";

export const metadata = { title: "Auditoría" };

const ACTION_VARIANT: Record<
  string,
  "primary" | "secondary" | "success" | "danger"
> = {
  create: "primary",
  update: "secondary",
  approve: "success",
  reject: "danger",
  delete: "danger",
};

export default async function AdminAuditPage() {
  await requireRole("ADMIN");
  const logs = await getAuditLogs(150);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Auditoría</h1>
        <p className="text-sm text-muted-foreground">
          Registro de acciones sensibles ({logs.length}).
        </p>
      </div>

      {logs.length === 0 ? (
        <GlassCard className="p-0">
          <EmptyState
            icon={ShieldCheck}
            title="Todavía no hay registros"
            description="Las acciones sensibles (pagos, configuración, roles) se registrarán acá."
          />
        </GlassCard>
      ) : (
        <GlassCard className="p-0">
          <ul className="divide-y divide-border">
            {logs.map((l) => (
              <li key={l.id} className="flex items-start gap-3 p-4">
                <Badge
                  variant={ACTION_VARIANT[l.action] ?? "neutral"}
                  className="mt-0.5 shrink-0"
                >
                  {l.action}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{l.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.entity}
                    {l.userEmail ? ` · ${l.userEmail}` : ""}
                    {" · "}
                    {formatDateTime(l.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
