import { SectionsForm } from "@/components/admin/sections-form";
import { SettingsTabs } from "@/components/admin/settings-tabs";
import { requireRole } from "@/lib/auth";
import { getSectionFlags } from "@/server/queries/settings";

export const metadata = { title: "Secciones de la landing" };

export default async function AdminSectionsPage() {
  await requireRole("ADMIN");
  const flags = await getSectionFlags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Secciones de la landing</h1>
        <p className="text-sm text-muted-foreground">
          Encendé o apagá cada bloque de la página principal.
        </p>
      </div>

      <SettingsTabs />

      <SectionsForm defaults={flags} />
    </div>
  );
}
