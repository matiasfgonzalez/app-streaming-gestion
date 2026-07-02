import { ThemeForm } from "@/components/admin/theme-form";
import { SettingsTabs } from "@/components/admin/settings-tabs";
import { requireRole } from "@/lib/auth";
import { getThemeConfig } from "@/server/queries/settings";

export const metadata = { title: "Tema" };

export default async function AdminThemePage() {
  await requireRole("ADMIN");
  const theme = await getThemeConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Tema</h1>
        <p className="text-sm text-muted-foreground">
          Colores, tipografías y estilo del sitio. Se aplica en claro y oscuro.
        </p>
      </div>

      <SettingsTabs />

      <ThemeForm defaults={theme} />
    </div>
  );
}
