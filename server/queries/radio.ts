import "server-only";
import { db } from "@/lib/db";
import { WEEKDAYS, DEFAULT_STREAMING, type StreamingConfig } from "@/lib/radio";
import type { Weekday } from "@prisma/client";

const scheduleOrder = [{ day: "asc" as const }, { startTime: "asc" as const }];

// ---------- Programas ----------
export function getActivePrograms() {
  return db.radioProgram.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: { schedules: { orderBy: scheduleOrder } },
  });
}

export function getAllProgramsAdmin() {
  return db.radioProgram.findMany({
    orderBy: { order: "asc" },
    include: { schedules: { orderBy: scheduleOrder } },
  });
}

export function getProgramById(id: string) {
  return db.radioProgram.findUnique({
    where: { id },
    include: { schedules: { orderBy: scheduleOrder } },
  });
}

export function getProgramBySlug(slug: string) {
  return db.radioProgram.findUnique({
    where: { slug },
    include: { schedules: { orderBy: scheduleOrder } },
  });
}

/** Opciones {id,name} de programas activos para asociar podcasts. */
export function getProgramOptions() {
  return db.radioProgram.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

type ProgramWithSchedules = Awaited<ReturnType<typeof getActivePrograms>>[number];
export type GridEntry = {
  programId: string;
  programName: string;
  slug: string;
  startTime: string;
  endTime: string;
  isRerun: boolean;
};

/** Grilla semanal: mapa día → franjas ordenadas por hora. */
export async function getWeeklyGrid(): Promise<Record<Weekday, GridEntry[]>> {
  const programs = await getActivePrograms();
  const grid = Object.fromEntries(WEEKDAYS.map((d) => [d, [] as GridEntry[]])) as Record<
    Weekday,
    GridEntry[]
  >;
  for (const p of programs as ProgramWithSchedules[]) {
    for (const s of p.schedules) {
      grid[s.day].push({
        programId: p.id,
        programName: p.name,
        slug: p.slug,
        startTime: s.startTime,
        endTime: s.endTime,
        isRerun: s.isRerun,
      });
    }
  }
  for (const d of WEEKDAYS) grid[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
  return grid;
}

// ---------- Podcasts ----------
export function getRecentPodcasts(take = 12) {
  return db.podcast.findMany({
    orderBy: { publishedAt: "desc" },
    take,
    include: { program: { select: { name: true, slug: true } } },
  });
}

export function getAllPodcastsAdmin() {
  return db.podcast.findMany({
    orderBy: { publishedAt: "desc" },
    include: { program: { select: { name: true } } },
  });
}

export function getPodcastById(id: string) {
  return db.podcast.findUnique({ where: { id } });
}

// ---------- Streaming (SiteSetting) ----------
export async function getStreamingConfig(): Promise<StreamingConfig> {
  const row = await db.siteSetting.findUnique({ where: { key: "streaming" } });
  if (!row) return DEFAULT_STREAMING;
  return { ...DEFAULT_STREAMING, ...(row.value as Partial<StreamingConfig>) };
}
