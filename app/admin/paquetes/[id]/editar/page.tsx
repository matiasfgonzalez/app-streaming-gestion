import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PackageForm } from "@/components/admin/package-form";
import { requireRole } from "@/lib/auth";
import { getPackageById } from "@/server/queries/ads";

export const metadata = { title: "Editar paquete" };

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  const pkg = await getPackageById(id);
  if (!pkg) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/paquetes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Editar paquete</h1>
      <PackageForm
        packageId={pkg.id}
        defaults={{
          name: pkg.name,
          description: pkg.description,
          priceMonthly: pkg.priceMonthly,
          priceWeekly: pkg.priceWeekly ?? 0,
          priceDaily: pkg.priceDaily ?? 0,
          features: pkg.features.join("\n"),
          active: pkg.active,
          order: pkg.order,
        }}
      />
    </div>
  );
}
