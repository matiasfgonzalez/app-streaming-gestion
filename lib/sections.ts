/** Secciones de la landing que el admin puede encender/apagar (Fase 8). */
export const LANDING_SECTIONS = [
  { key: "stats", label: "Estadísticas" },
  { key: "about", label: "Qué es" },
  { key: "radio", label: "Radio" },
  { key: "streaming", label: "Streaming" },
  { key: "news", label: "Noticias" },
  { key: "events", label: "Eventos" },
  { key: "sports", label: "Cobertura deportiva" },
  { key: "services", label: "Servicios y precios" },
  { key: "sponsors", label: "Sponsors" },
  { key: "gallery", label: "Galería" },
  { key: "videos", label: "Videos" },
  { key: "testimonials", label: "Testimonios" },
  { key: "faq", label: "Preguntas frecuentes" },
  { key: "contact", label: "Contacto" },
] as const;

export type SectionKey = (typeof LANDING_SECTIONS)[number]["key"];
export type SectionFlags = Record<SectionKey, boolean>;

export const DEFAULT_SECTION_FLAGS: SectionFlags = Object.fromEntries(
  LANDING_SECTIONS.map((s) => [s.key, true]),
) as SectionFlags;

/** Combina flags guardados con los defaults (todo encendido). */
export function mergeSectionFlags(stored: unknown): SectionFlags {
  const s = (stored ?? {}) as Partial<SectionFlags>;
  const out = { ...DEFAULT_SECTION_FLAGS };
  for (const { key } of LANDING_SECTIONS) {
    if (typeof s[key] === "boolean") out[key] = s[key] as boolean;
  }
  return out;
}
