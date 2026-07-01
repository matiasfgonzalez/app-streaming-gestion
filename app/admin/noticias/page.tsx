import { Pencil, Plus, Star, Zap } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DeleteNewsButton } from "@/components/admin/delete-news-button";
import { requireRole } from "@/lib/auth";
import { getAllNewsAdmin } from "@/server/queries/news";
import { cn } from "@/lib/utils";

export const metadata = { title: "Noticias" };

export default async function AdminNewsPage() {
  await requireRole("ADMIN", "EDITOR");
  const news = await getAllNewsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Noticias</h1>
          <p className="text-sm text-muted-foreground">
            {news.length} {news.length === 1 ? "noticia" : "noticias"}
          </p>
        </div>
        <Link href="/admin/noticias/nueva" className={neuButton()}>
          <Plus /> Nueva
        </Link>
      </div>

      {news.length === 0 ? (
        <GlassCard className="py-16 text-center text-muted-foreground">
          Todavía no hay noticias. Creá la primera.
        </GlassCard>
      ) : (
        <GlassCard className="p-0">
          <ul className="divide-y divide-border">
            {news.map((n) => (
              <li key={n.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        n.status === "PUBLISHED"
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {n.status === "PUBLISHED" ? "Publicada" : "Borrador"}
                    </span>
                    {n.featured && <Star className="size-3.5 text-primary" />}
                    {n.breaking && <Zap className="size-3.5 text-secondary" />}
                  </div>
                  <p className="mt-1 truncate font-medium">{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {n.author?.name ?? "—"} ·{" "}
                    {n.categories.map((c) => c.name).join(", ") || "sin categoría"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/noticias/${n.id}/editar`}
                    aria-label="Editar"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteNewsButton id={n.id} />
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
