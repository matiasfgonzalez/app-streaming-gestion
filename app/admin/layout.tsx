import { AdminShell } from "@/components/admin/admin-shell";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Panel de administración" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Solo ADMIN y EDITOR acceden al panel. El detalle por sección lo gatea cada página.
  const user = await requireRole("ADMIN", "EDITOR");

  return (
    <AdminShell role={user.role} userName={user.name}>
      {children}
    </AdminShell>
  );
}
