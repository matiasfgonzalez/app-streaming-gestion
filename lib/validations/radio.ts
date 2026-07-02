import { z } from "zod";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;

export const scheduleSchema = z.object({
  day: z.enum(WEEKDAYS),
  startTime: z.string().regex(timeRe, "Hora HH:MM"),
  endTime: z.string().regex(timeRe, "Hora HH:MM"),
  isRerun: z.boolean(),
});
export type ScheduleInput = z.infer<typeof scheduleSchema>;

export const radioProgramSchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(120),
  description: z.string().max(1000).optional(),
  hosts: z.string().max(300).optional(), // CSV
  guests: z.string().max(300).optional(), // CSV
  coverUrl: z.url("URL inválida").optional().or(z.literal("")),
  active: z.boolean(),
  order: z.number().int().min(0),
  schedules: z.array(scheduleSchema).max(30),
});
export type RadioProgramInput = z.infer<typeof radioProgramSchema>;

export const podcastSchema = z
  .object({
    title: z.string().min(2, "Título muy corto").max(160),
    description: z.string().max(1000).optional(),
    audioUrl: z.url("URL inválida").optional().or(z.literal("")),
    youtubeId: z.string().max(40).optional(),
    coverUrl: z.url("URL inválida").optional().or(z.literal("")),
    programId: z.string().optional(),
    publishedAt: z.string().optional(),
  })
  .refine((d) => (d.audioUrl && d.audioUrl.length > 0) || (d.youtubeId && d.youtubeId.length > 0), {
    message: "Cargá un audio o un ID de YouTube",
    path: ["audioUrl"],
  });
export type PodcastInput = z.infer<typeof podcastSchema>;

export const streamingSchema = z.object({
  youtubeId: z.string().min(3, "ID de YouTube requerido").max(40),
  title: z.string().max(160).optional(),
  channelUrl: z.url("URL inválida").optional().or(z.literal("")),
});
export type StreamingInput = z.infer<typeof streamingSchema>;
