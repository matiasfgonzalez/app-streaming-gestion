import { z } from "zod";
import { FONT_NAMES } from "@/lib/theme";

const hex = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color inválido (hex)");

const colors = z.object({
  primary: hex,
  secondary: hex,
  accent: hex,
});

export const themeSchema = z.object({
  light: colors,
  dark: colors,
  radius: z.number().min(0).max(2),
  fontDisplay: z.enum(FONT_NAMES),
  fontBody: z.enum(FONT_NAMES),
  animations: z.boolean(),
});
export type ThemeInput = z.infer<typeof themeSchema>;
