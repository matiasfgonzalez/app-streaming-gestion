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
  title?: string;
  channelUrl?: string;
};

export const DEFAULT_STREAMING: StreamingConfig = {
  youtubeId: "jfKfPfyJRdk", // demo (lofi) — reemplazable desde admin
  title: "Streaming en vivo",
};
