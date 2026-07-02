import { ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { requireRole } from "@/lib/auth";
import { getAuditLogs } from "@/server/queries/analytics";
import { formatDateTime } from "@/lib/format";
import { Badge, DataTable, EmptyState, type Column } from "@/components/ui";

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

type LogRow = Awaited<ReturnType<typeof getAuditLogs>>[number];

const columns: Column<LogRow>[] = [
  {
    key: "action",
    header: "Acción",
    cell: (l) => <Badge variant={ACTION_VARIANT[l.action] ?? "neutral"}>{l.action}</Badge>,
    className: "w-28",
  },
  {
    key: "summary",
    header: "Detalle",
    primary: true,
    cell: (l) => (
      <div className="min-w-0">
        <p className="text-sm">{l.summary}</p>
        <p className="truncate text-xs text-muted-foreground">
          {l.entity}
          {l.userEmail ? ` · ${l.userEmail}` : ""}
        </p>
      </div>
    ),
  },
  {
    key: "date",
    header: "Fecha",
    cell: (l) => (
      <span className="whitespace-nowrap text-xs text-muted-foreground tnum">
        {formatDateTime(l.createdAt)}
      </span>
    ),
  },
];

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
        <DataTable columns={columns} rows={logs} getKey={(l) => l.id} />
      )}
    </div>
  );
}
