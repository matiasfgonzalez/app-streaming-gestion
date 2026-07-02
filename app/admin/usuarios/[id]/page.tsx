import Link from "next/link";
import { ArrowLeft, Megaphone } from "lucide-react";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/glass/glass-card";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { ClientProfileForm } from "@/components/admin/client-profile-form";
import { requireRole } from "@/lib/auth";
import { getUserById } from "@/server/queries/users";
import { ROLE_CLS, ROLE_LABEL } from "@/lib/users";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Usuario" };

const CONTRACT_LABEL: Record<string, string> = {
  DRAFT: "Borrador",
  PENDING: "Pendiente",
  ACTIVE: "Activo",
  REJECTED: "Rechazado",
  EXPIRED: "Vencido",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireRole("ADMIN");
  const { id } = await params;
  const u = await getUserById(id);
  if (!u) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/usuarios" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>

      <GlassCard className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold">{u.name ?? "Sin nombre"}</h1>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", ROLE_CLS[u.role])}>
              {ROLE_LABEL[u.role]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{u.email}</p>
          <p className="text-xs text-muted-foreground">
            Alta {formatDate(u.createdAt)} · {u._count.contracts} contratos · {u._count.news} noticias
          </p>
        </div>
        <div>
          <p className="mb-1.5 text-right text-xs text-muted-foreground">Rol</p>
          <UserRoleSelect userId={u.id} role={u.role} disabled={u.id === admin.id} />
        </div>
      </GlassCard>

      <ClientProfileForm
        userId={u.id}
        defaults={{
          company: u.clientProfile?.company ?? "",
          phone: u.clientProfile?.phone ?? "",
          taxId: u.clientProfile?.taxId ?? "",
          notes: u.clientProfile?.notes ?? "",
        }}
      />

      <GlassCard className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Contrataciones</h2>
        {u.contracts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Este usuario no tiene contrataciones.</p>
        ) : (
          <ul className="divide-y divide-border">
            {u.contracts.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <Megaphone className="size-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/publicidad/${c.id}`} className="truncate font-medium hover:text-primary">
                    {c.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {c.package.name} · {formatDate(c.createdAt)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {CONTRACT_LABEL[c.status] ?? c.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
