import type { EventStatus, QuoteService, QuoteStatus } from "@prisma/client";

/** Servicios disponibles para solicitar presupuesto (clave enum → etiqueta). */
export const QUOTE_SERVICES: { value: QuoteService; label: string }[] = [
  { value: "INTERNET", label: "Internet" },
  { value: "STREAMING", label: "Streaming" },
  { value: "FOTOS", label: "Fotos" },
  { value: "VIDEOS", label: "Videos / Reels" },
  { value: "CONDUCTOR", label: "Conductor / Animador" },
  { value: "PUBLICIDAD", label: "Publicidad" },
  { value: "REDES", label: "Redes" },
  { value: "COMMUNITY_MANAGER", label: "Community Manager" },
  { value: "ENTREVISTAS", label: "Entrevistas" },
  { value: "COBERTURA", label: "Cobertura Periodística" },
];

export const QUOTE_SERVICE_LABEL: Record<QuoteService, string> =
  Object.fromEntries(QUOTE_SERVICES.map((s) => [s.value, s.label])) as Record<
    QuoteService,
    string
  >;

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  UPCOMING: "Próximamente",
  LIVE: "En vivo",
  FINISHED: "Finalizado",
};

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  NEW: "Nueva",
  IN_REVIEW: "En revisión",
  QUOTED: "Presupuestada",
  CLOSED: "Cerrada",
};

/** URL de embed de Google Maps sin API key. */
export function mapEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
