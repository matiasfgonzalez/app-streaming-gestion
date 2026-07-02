import { Mic, Radio as RadioIcon, Repeat, Users } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Reveal } from "@/components/glass/reveal";
import { Container, Section, SectionHeading } from "@/components/glass/section";
import { getActivePrograms, getRecentPodcasts, getWeeklyGrid } from "@/server/queries/radio";
import { WEEKDAYS, WEEKDAY_LABEL } from "@/lib/radio";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Radio",
  description: "Programación semanal, conductores y podcasts de Viva La Mañana.",
};

export default async function RadioPage() {
  const [grid, programs, podcasts] = await Promise.all([
    getWeeklyGrid(),
    getActivePrograms(),
    getRecentPodcasts(12),
  ]);

  const hasGrid = WEEKDAYS.some((d) => grid[d].length > 0);

  return (
    <>
      <Section className="pt-24 pb-8">
        <Container>
          <SectionHeading
            eyebrow="Al aire"
            title="Nuestra radio"
            subtitle="Programación semanal, conductores y programas anteriores."
          />
        </Container>
      </Section>

      {/* Grilla semanal */}
      <Section className="py-8">
        <Container>
          <h2 className="mb-6 font-display text-xl font-bold">Programación semanal</h2>
          {!hasGrid ? (
            <GlassCard className="py-12 text-center text-muted-foreground">
              Todavía no cargamos la grilla. Volvé pronto.
            </GlassCard>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {WEEKDAYS.map((day) => (
                <Reveal key={day}>
                  <GlassCard className="h-full space-y-3 p-4">
                    <h3 className="font-display text-sm font-bold text-primary">{WEEKDAY_LABEL[day]}</h3>
                    {grid[day].length === 0 ? (
                      <p className="text-xs text-muted-foreground">—</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {grid[day].map((s, i) => (
                          <li key={i} className="text-sm">
                            <p className="font-medium">{s.programName}</p>
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              {s.startTime}–{s.endTime}
                              {s.isRerun && (
                                <span className="inline-flex items-center gap-0.5 text-[0.7rem]">
                                  <Repeat className="size-3" /> repetición
                                </span>
                              )}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Programas / conductores */}
      {programs.length > 0 && (
        <Section className="py-8">
          <Container>
            <h2 className="mb-6 font-display text-xl font-bold">Programas y conductores</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <Reveal key={p.id}>
                  <GlassCard className="h-full overflow-hidden p-0">
                    {p.coverUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.coverUrl} alt={p.name} className="aspect-video w-full object-cover" />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-muted text-muted-foreground">
                        <RadioIcon className="size-8" />
                      </div>
                    )}
                    <div className="space-y-2 p-5">
                      <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                      {p.description && (
                        <p className="line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                      )}
                      {p.hosts.length > 0 && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="size-3.5" /> {p.hosts.join(", ")}
                        </p>
                      )}
                      {p.guests.length > 0 && (
                        <p className="text-xs text-muted-foreground">Invitados: {p.guests.join(", ")}</p>
                      )}
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Podcasts / programas anteriores */}
      {podcasts.length > 0 && (
        <Section className="py-8">
          <Container>
            <h2 className="mb-6 font-display text-xl font-bold">Programas anteriores</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {podcasts.map((pod) => (
                <Reveal key={pod.id}>
                  <GlassCard className="h-full space-y-3 p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mic className="size-3.5" />
                      {formatDate(pod.publishedAt)}
                      {pod.program ? ` · ${pod.program.name}` : ""}
                    </div>
                    <h3 className="font-display text-base font-semibold">{pod.title}</h3>
                    {pod.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{pod.description}</p>
                    )}
                    {pod.youtubeId ? (
                      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                        <iframe
                          className="size-full"
                          src={`https://www.youtube-nocookie.com/embed/${pod.youtubeId}`}
                          title={pod.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    ) : pod.audioUrl ? (
                      <audio controls src={pod.audioUrl} className="w-full" />
                    ) : null}
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
