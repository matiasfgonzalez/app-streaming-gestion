/** Configuración global del sitio, persistida en SiteSetting["site"]. */
export type SiteConfig = {
  brandName: string;
  tagline: string;
  description: string;
  /** Logo de la marca (cuadrado, fondo transparente). Vacío = ícono por defecto. */
  logoUrl: string;
  /** Imagen de portada/banner (16:9) usada en el hero. Vacío = card "al aire" sola. */
  coverUrl: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    mapsUrl: string; // URL de embed de Google Maps (src del iframe)
  };
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
    whatsapp: string;
  };
  seo: {
    title: string;
    description: string;
  };
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: "Viva La Mañana",
  tagline: "Radio, Streaming y Eventos",
  description:
    "Radio, streaming, cobertura de eventos y publicidad. Todo en un solo lugar.",
  logoUrl: "",
  coverUrl: "",
  contact: {
    email: "contacto@vivalamanana.com",
    phone: "+54 000 000 0000",
    address: "Av. Siempre Viva 123, Ciudad",
    mapsUrl: "",
  },
  socials: {
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    whatsapp: "",
  },
  seo: {
    title: "Viva La Mañana — Radio, Streaming y Eventos",
    description:
      "Viva La Mañana: radio, streaming, cobertura de eventos y publicidad. Todo en un solo lugar.",
  },
};

/** Combina la config guardada (parcial) con los defaults, campo por campo. */
export function mergeSiteConfig(stored: unknown): SiteConfig {
  const s = (stored ?? {}) as Partial<SiteConfig>;
  return {
    brandName: s.brandName ?? DEFAULT_SITE_CONFIG.brandName,
    tagline: s.tagline ?? DEFAULT_SITE_CONFIG.tagline,
    description: s.description ?? DEFAULT_SITE_CONFIG.description,
    logoUrl: s.logoUrl ?? DEFAULT_SITE_CONFIG.logoUrl,
    coverUrl: s.coverUrl ?? DEFAULT_SITE_CONFIG.coverUrl,
    contact: { ...DEFAULT_SITE_CONFIG.contact, ...s.contact },
    socials: { ...DEFAULT_SITE_CONFIG.socials, ...s.socials },
    seo: { ...DEFAULT_SITE_CONFIG.seo, ...s.seo },
  };
}
