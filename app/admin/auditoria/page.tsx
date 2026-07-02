import { ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { requireRole } from "@/lib/auth";
import { getAuditLogs } from "@/server/queries/analytics";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Auditoría" };

const ACTION_CLS: Record<string, string> = {
  create: "bg-primary/15 text-primary",
  update: "bg-accent/20 text-accent-foreground",
  approve: "bg-primary/15 text-primary",
  reject: "bg-destructive/10 text-destructive",
  delete: "bg-destructive/10 text-destructive",
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
        <GlassCard className="py-16 text-center text-muted-foreground">
          <ShieldCheck className="mx-auto mb-2 size-8 text-primary" />
          Todavía no hay registros.
        </GlassCard>
      ) : (
        <GlassCard className="p-0">
          <ul className="divide-y divide-border">
            {logs.map((l) => (
              <li key={l.id} className="flex items-start gap-3 p-4">
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                    ACTION_CLS[l.action] ?? "bg-muted text-muted-foreground",
                  )}
                >
                  {l.action}
                </span>
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
