import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PackageForm } from "@/components/admin/package-form";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Nuevo paquete" };

export default async function NewPackagePage() {
  await requireRole("ADMIN");
  return (
    <div className="space-y-6">
      <Link href="/admin/paquetes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Nuevo paquete</h1>
      <PackageForm />
    </div>
  );
}
