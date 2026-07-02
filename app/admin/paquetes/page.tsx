import { Package, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DeletePackageButton } from "@/components/admin/delete-package-button";
import { requireRole } from "@/lib/auth";
import { getAllPackagesAdmin } from "@/server/queries/ads";
import { formatMoney } from "@/lib/format";
import { Badge, DataTable, EmptyState, type Column } from "@/components/ui";

export const metadata = { title: "Paquetes" };

type PackageRow = Awaited<ReturnType<typeof getAllPackagesAdmin>>[number];

const columns: Column<PackageRow>[] = [
  {
    key: "name",
    header: "Paquete",
    primary: true,
    cell: (p) => (
      <div className="flex items-center gap-2">
        <span className="truncate font-medium">{p.name}</span>
        {!p.active && <Badge variant="neutral">Inactivo</Badge>}
      </div>
    ),
  },
  {
    key: "price",
    header: "Precio",
    cell: (p) => <span className="text-sm tnum">{formatMoney(p.priceMonthly)}/mes</span>,
  },
  {
    key: "actions",
    header: "Acciones",
    action: true,
    cell: (p) => (
      <div className="inline-flex items-center gap-1">
        <Link
          href={`/admin/paquetes/${p.id}/editar`}
          aria-label="Editar"
          className="inline-flex size-11 items-center justify-center rounded-lg md:size-9 text-foreground/80 transition-colors hover:bg-muted"
        >
          <Pencil className="size-4" />
        </Link>
        <DeletePackageButton id={p.id} />
      </div>
    ),
  },
];

export default async function AdminPackagesPage() {
  await requireRole("ADMIN");
  const packages = await getAllPackagesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Paquetes</h1>
          <p className="text-sm text-muted-foreground">{packages.length} paquetes</p>
        </div>
        <Link href="/admin/paquetes/nuevo" className={neuButton()}>
          <Plus /> Nuevo
        </Link>
      </div>

      {packages.length === 0 ? (
        <GlassCard className="p-0">
          <EmptyState
            icon={Package}
            title="Todavía no hay paquetes"
            description="Creá el primer paquete de publicidad para que los clientes puedan contratarlo."
            action={
              <Link href="/admin/paquetes/nuevo" className={neuButton()}>
                <Plus /> Nuevo paquete
              </Link>
            }
          />
        </GlassCard>
      ) : (
        <DataTable columns={columns} rows={packages} getKey={(p) => p.id} />
      )}
    </div>
  );
}
