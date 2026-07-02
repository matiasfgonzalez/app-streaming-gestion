import { ImageIcon, Pencil, Play, Plus, Star } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DeleteMediaButton } from "@/components/admin/delete-media-button";
import { requireRole } from "@/lib/auth";
import { getAllMediaAdmin } from "@/server/queries/media";

export const metadata = { title: "Galería" };

export default async function AdminMediaPage() {
  await requireRole("ADMIN", "EDITOR");
  const items = await getAllMediaAdmin();
  const images = items.filter((i) => i.type === "IMAGE").length;
  const videos = items.filter((i) => i.type === "VIDEO").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Galería</h1>
          <p className="text-sm text-muted-foreground">{images} imágenes · {videos} videos</p>
        </div>
        <Link href="/admin/media/nuevo" className={neuButton()}>
          <Plus /> Nuevo
        </Link>
      </div>

      {items.length === 0 ? (
        <GlassCard className="py-16 text-center text-muted-foreground">
          Todavía no hay elementos. Agregá imágenes o videos.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => {
            const thumb = m.type === "VIDEO" && m.youtubeId
              ? `https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg`
              : m.url;
            return (
              <GlassCard key={m.id} className="group space-y-2 p-3">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  {thumb ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={thumb} alt={m.title ?? ""} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-6" />
                    </div>
                  )}
                  {m.type === "VIDEO" && (
                    <span className="absolute inset-0 m-auto flex size-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground">
                      <Play className="size-5 translate-x-0.5" />
                    </span>
                  )}
                  {m.featured && (
                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[0.65rem] font-medium text-primary-foreground">
                      <Star className="size-2.5" /> Destacada
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="min-w-0 flex-1 truncate text-sm font-medium">{m.title ?? "Sin título"}</p>
                  <div className="flex shrink-0 items-center">
                    <Link
                      href={`/admin/media/${m.id}/editar`}
                      aria-label="Editar"
                      className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteMediaButton id={m.id} />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
