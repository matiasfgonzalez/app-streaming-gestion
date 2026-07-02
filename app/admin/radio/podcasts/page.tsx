import { Mic, Pencil, Plus, Video } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { RadioTabs } from "@/components/admin/radio-tabs";
import { DeletePodcastButton } from "@/components/admin/delete-podcast-button";
import { requireRole } from "@/lib/auth";
import { getAllPodcastsAdmin } from "@/server/queries/radio";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui";

export const metadata = { title: "Podcasts" };

export default async function AdminPodcastsPage() {
  await requireRole("ADMIN", "EDITOR");
  const podcasts = await getAllPodcastsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Podcasts</h1>
          <p className="text-sm text-muted-foreground">{podcasts.length} episodios</p>
        </div>
        <Link href="/admin/radio/podcasts/nuevo" className={neuButton()}>
          <Plus /> Nuevo
        </Link>
      </div>

      <RadioTabs />

      {podcasts.length === 0 ? (
        <GlassCard className="p-0">
          <EmptyState
            icon={Mic}
            title="Todavía no hay podcasts"
            description="Subí un audio o enlazá un video de YouTube para publicar el primer episodio."
            action={
              <Link href="/admin/radio/podcasts/nuevo" className={neuButton()}>
                <Plus /> Nuevo podcast
              </Link>
            }
          />
        </GlassCard>
      ) : (
        <GlassCard className="p-0">
          <ul className="divide-y divide-border">
            {podcasts.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                {p.coverUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.coverUrl} alt={p.title} className="size-14 rounded-lg object-cover" />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {p.youtubeId ? <Video className="size-5" /> : <Mic className="size-5" />}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatDate(p.publishedAt)}
                    {p.program ? ` · ${p.program.name}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/radio/podcasts/${p.id}/editar`}
                    aria-label="Editar"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeletePodcastButton id={p.id} />
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
