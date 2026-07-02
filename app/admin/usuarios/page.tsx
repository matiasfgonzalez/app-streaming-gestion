import { Eye } from "lucide-react";
import Link from "next/link";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { requireRole } from "@/lib/auth";
import { getAllUsers } from "@/server/queries/users";
import { formatDate } from "@/lib/format";
import { Badge, DataTable, type Column } from "@/components/ui";

export const metadata = { title: "Usuarios" };

type UserRow = Awaited<ReturnType<typeof getAllUsers>>[number];

function buildColumns(adminId: string): Column<UserRow>[] {
  return [
    {
      key: "user",
      header: "Usuario",
      primary: true,
      cell: (u) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{u.name ?? "Sin nombre"}</span>
            {u.id === adminId && <Badge variant="primary">Vos</Badge>}
          </div>
          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
        </div>
      ),
    },
    {
      key: "activity",
      header: "Actividad",
      cell: (u) => (
        <span className="text-xs text-muted-foreground">
          {u.clientProfile?.company ? `${u.clientProfile.company} · ` : ""}
          {u._count.contracts} contratos · {u._count.news} noticias · alta {formatDate(u.createdAt)}
        </span>
      ),
    },
    {
      key: "role",
      header: "Rol",
      cell: (u) => <UserRoleSelect userId={u.id} role={u.role} disabled={u.id === adminId} />,
    },
    {
      key: "actions",
      header: "Acciones",
      action: true,
      cell: (u) => (
        <Link
          href={`/admin/usuarios/${u.id}`}
          aria-label="Ver detalle"
          className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
        >
          <Eye className="size-4" />
        </Link>
      ),
    },
  ];
}

export default async function AdminUsersPage() {
  const admin = await requireRole("ADMIN");
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Usuarios</h1>
        <p className="text-sm text-muted-foreground">{users.length} usuarios registrados</p>
      </div>

      <DataTable columns={buildColumns(admin.id)} rows={users} getKey={(u) => u.id} />
    </div>
  );
}
