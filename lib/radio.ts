import type { Weekday } from "@prisma/client";

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  MON: "Lunes",
  TUE: "Martes",
  WED: "Miércoles",
  THU: "Jueves",
  FRI: "Viernes",
  SAT: "Sábado",
  SUN: "Domingo",
};

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  MON: "Lun",
  TUE: "Mar",
  WED: "Mié",
  THU: "Jue",
  FRI: "Vie",
  SAT: "Sáb",
  SUN: "Dom",
};

/** Orden lunes→domingo para grillas. */
export const WEEKDAYS: Weekday[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/** Config de streaming persistida en SiteSetting (key "streaming"). */
export type StreamingConfig = {
  youtubeId: string;
  /** URL pública del vivo/video de Facebook (se embebe con plugins/video.php). */
  facebookUrl?: string;
  title?: string;
  channelUrl?: string;
};

export const DEFAULT_STREAMING: StreamingConfig = {
  youtubeId: "jfKfPfyJRdk", // demo (lofi) — reemplazable desde admin
  title: "Streaming en vivo",
};

/** Embed de Facebook para un vivo/video público (sin API key). */
export function facebookEmbedUrl(videoUrl: string): string {
  const params = new URLSearchParams({
    href: videoUrl,
    show_text: "false",
    autoplay: "false",
  });
  return `https://www.facebook.com/plugins/video.php?${params.toString()}`;
}
