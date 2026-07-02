import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { AdminContractForm } from "@/components/admin/admin-contract-form";
import { requireRole } from "@/lib/auth";
import { getActivePackages } from "@/server/queries/ads";

export const metadata = { title: "Nueva publicidad" };

export default async function NewAdminContractPage() {
  await requireRole("ADMIN");
  const packages = await getActivePackages();

  return (
    <div className="space-y-6">
      <Link href="/admin/publicidad" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Crear publicidad (sin cliente)</h1>
      {packages.length === 0 ? (
        <GlassCard className="py-10 text-center text-muted-foreground">
          Primero creá al menos un paquete activo.
        </GlassCard>
      ) : (
        <AdminContractForm packages={packages.map((p) => ({ id: p.id, name: p.name }))} />
      )}
    </div>
  );
}
