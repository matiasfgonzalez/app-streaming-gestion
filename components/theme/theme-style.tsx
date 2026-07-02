import { getThemeConfig } from "@/server/queries/settings";
import { googleFontsHref, themeCss } from "@/lib/theme";

/**
 * Inyecta los tokens del theme editable (Fase 9) sobrescribiendo globals.css,
 * y carga las tipografías elegidas desde Google Fonts. Server component: se
 * renderiza al inicio del <body> para ganar en el orden de la cascada.
 */
export async function ThemeStyle() {
  const theme = await getThemeConfig();
  const fontsHref = googleFontsHref([theme.fontDisplay, theme.fontBody]);

  return (
    <>
      <link rel="stylesheet" href={fontsHref} />
      <style dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
    </>
  );
}
