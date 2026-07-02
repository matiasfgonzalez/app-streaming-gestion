import { Eye } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { requireRole } from "@/lib/auth";
import { getAllUsers } from "@/server/queries/users";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Usuarios" };

export default async function AdminUsersPage() {
  const admin = await requireRole("ADMIN");
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Usuarios</h1>
        <p className="text-sm text-muted-foreground">{users.length} usuarios registrados</p>
      </div>

      <GlassCard className="p-0">
        <ul className="divide-y divide-border">
          {users.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{u.name ?? "Sin nombre"}</p>
                  {u.id === admin.id && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">Vos</span>
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">{u.email}</p>
                <p className="text-xs text-muted-foreground">
                  {u.clientProfile?.company ? `${u.clientProfile.company} · ` : ""}
                  {u._count.contracts} contratos · {u._count.news} noticias · alta {formatDate(u.createdAt)}
                </p>
              </div>

              <UserRoleSelect userId={u.id} role={u.role} disabled={u.id === admin.id} />

              <Link
                href={`/admin/usuarios/${u.id}`}
                aria-label="Ver detalle"
                className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
              >
                <Eye className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
