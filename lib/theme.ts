/** Theme Engine (Fase 9): paleta, radius, tipografías y animaciones editables.
 *  Persistido en SiteSetting["theme"]; se inyecta como CSS vars en el layout. */

export const FONT_NAMES = [
  "Inter",
  "Space Grotesk",
  "Poppins",
  "Montserrat",
  "Manrope",
  "Sora",
  "Roboto",
  "Nunito",
  "Playfair Display",
  "Lora",
] as const;
export type FontName = (typeof FONT_NAMES)[number];

const SERIF_FONTS = new Set<string>(["Playfair Display", "Lora"]);

/** Familia + fallback apropiado (serif/sans) para usar en `font-family`. */
export function fontStack(name: string): string {
  const fallback = SERIF_FONTS.has(name)
    ? "ui-serif, Georgia, serif"
    : "ui-sans-serif, system-ui, sans-serif";
  return `"${name}", ${fallback}`;
}

/** URL de Google Fonts para las familias elegidas (dedupe, pesos 400–700). */
export function googleFontsHref(families: string[]): string {
  const uniq = [...new Set(families)].filter(Boolean);
  const params = uniq
    .map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
};

export type ThemeConfig = {
  light: ThemeColors;
  dark: ThemeColors;
  radius: number; // rem
  fontDisplay: FontName;
  fontBody: FontName;
  animations: boolean;
};

export const DEFAULT_THEME: ThemeConfig = {
  light: { primary: "#f4813a", secondary: "#9a4be3", accent: "#4fc5d6" },
  dark: { primary: "#f79340", secondary: "#a662ea", accent: "#58cad9" },
  radius: 0.9,
  fontDisplay: "Space Grotesk",
  fontBody: "Inter",
  animations: true,
};

export function mergeTheme(stored: unknown): ThemeConfig {
  const s = (stored ?? {}) as Partial<ThemeConfig>;
  return {
    light: { ...DEFAULT_THEME.light, ...s.light },
    dark: { ...DEFAULT_THEME.dark, ...s.dark },
    radius: typeof s.radius === "number" ? s.radius : DEFAULT_THEME.radius,
    fontDisplay: (FONT_NAMES as readonly string[]).includes(s.fontDisplay ?? "")
      ? (s.fontDisplay as FontName)
      : DEFAULT_THEME.fontDisplay,
    fontBody: (FONT_NAMES as readonly string[]).includes(s.fontBody ?? "")
      ? (s.fontBody as FontName)
      : DEFAULT_THEME.fontBody,
    animations: typeof s.animations === "boolean" ? s.animations : DEFAULT_THEME.animations,
  };
}

/** Genera el CSS que sobrescribe los tokens de globals.css. */
export function themeCss(t: ThemeConfig): string {
  const display = fontStack(t.fontDisplay);
  const body = fontStack(t.fontBody);
  return [
    `:root{`,
    `--primary:${t.light.primary};`,
    `--secondary:${t.light.secondary};`,
    `--accent:${t.light.accent};`,
    `--ring:${t.light.primary};`,
    `--glow:${t.light.accent};`,
    `--radius:${t.radius}rem;`,
    `--font-display:${display};`,
    `--font-sans:${body};`,
    `}`,
    `.dark{`,
    `--primary:${t.dark.primary};`,
    `--secondary:${t.dark.secondary};`,
    `--accent:${t.dark.accent};`,
    `--ring:${t.dark.primary};`,
    `--glow:${t.dark.accent};`,
    `}`,
    t.animations ? "" : `.animate-aurora{animation:none!important}`,
  ].join("");
}
