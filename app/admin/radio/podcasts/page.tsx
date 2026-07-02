import { Mic, Pencil, Plus, Video } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { RadioTabs } from "@/components/admin/radio-tabs";
import { DeletePodcastButton } from "@/components/admin/delete-podcast-button";
import { requireRole } from "@/lib/auth";
import { getAllPodcastsAdmin } from "@/server/queries/radio";
import { formatDate } from "@/lib/format";
import { DataTable, EmptyState, type Column } from "@/components/ui";

export const metadata = { title: "Podcasts" };

type PodcastRow = Awaited<ReturnType<typeof getAllPodcastsAdmin>>[number];

const columns: Column<PodcastRow>[] = [
  {
    key: "title",
    header: "Episodio",
    primary: true,
    cell: (p) => (
      <div className="flex items-center gap-3">
        {p.coverUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={p.coverUrl} alt={p.title} className="size-11 shrink-0 rounded-lg object-cover" />
        ) : (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {p.youtubeId ? <Video className="size-5" /> : <Mic className="size-5" />}
          </div>
        )}
        <span className="min-w-0 truncate font-medium">{p.title}</span>
      </div>
    ),
  },
  {
    key: "published",
    header: "Publicado",
    cell: (p) => (
      <span className="text-xs text-muted-foreground tnum">
        {formatDate(p.publishedAt)}
        {p.program ? ` · ${p.program.name}` : ""}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Acciones",
    action: true,
    cell: (p) => (
      <div className="inline-flex items-center gap-1">
        <Link
          href={`/admin/radio/podcasts/${p.id}/editar`}
          aria-label="Editar"
          className="inline-flex size-11 items-center justify-center rounded-lg md:size-9 text-foreground/80 transition-colors hover:bg-muted"
        >
          <Pencil className="size-4" />
        </Link>
        <DeletePodcastButton id={p.id} />
      </div>
    ),
  },
];

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
        <DataTable columns={columns} rows={podcasts} getKey={(p) => p.id} />
      )}
    </div>
  );
}
