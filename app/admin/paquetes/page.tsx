import { Package, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DeletePackageButton } from "@/components/admin/delete-package-button";
import { requireRole } from "@/lib/auth";
import { getAllPackagesAdmin } from "@/server/queries/ads";
import { formatMoney } from "@/lib/format";
import { EmptyState } from "@/components/ui";

export const metadata = { title: "Paquetes" };

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
        <GlassCard className="p-0">
          <ul className="divide-y divide-border">
            {packages.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{p.name}</p>
                    {!p.active && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatMoney(p.priceMonthly)}/mes
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/paquetes/${p.id}/editar`}
                    aria-label="Editar"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeletePackageButton id={p.id} />
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
