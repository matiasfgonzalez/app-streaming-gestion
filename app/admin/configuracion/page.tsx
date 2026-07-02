import { SiteConfigForm } from "@/components/admin/site-config-form";
import { SettingsTabs } from "@/components/admin/settings-tabs";
import { requireRole } from "@/lib/auth";
import { getSiteConfig } from "@/server/queries/settings";

export const metadata = { title: "Configuración" };

export default async function AdminConfigPage() {
  await requireRole("ADMIN");
  const cfg = await getSiteConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Datos del sitio, contacto, redes y SEO.
        </p>
      </div>

      <SettingsTabs />

      <SiteConfigForm defaults={cfg} />
    </div>
  );
}
