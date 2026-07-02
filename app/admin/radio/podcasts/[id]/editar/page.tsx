import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PodcastForm } from "@/components/admin/podcast-form";
import { requireRole } from "@/lib/auth";
import { getPodcastById, getProgramOptions } from "@/server/queries/radio";
import { toDatetimeLocal } from "@/lib/format";

export const metadata = { title: "Editar podcast" };

export default async function EditPodcastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN", "EDITOR");
  const { id } = await params;
  const [p, programs] = await Promise.all([getPodcastById(id), getProgramOptions()]);
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/radio/podcasts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Editar podcast</h1>
      <PodcastForm
        podcastId={p.id}
        programs={programs}
        defaults={{
          title: p.title,
          description: p.description ?? "",
          audioUrl: p.audioUrl ?? "",
          youtubeId: p.youtubeId ?? "",
          coverUrl: p.coverUrl ?? "",
          programId: p.programId ?? "",
          publishedAt: toDatetimeLocal(p.publishedAt),
        }}
      />
    </div>
  );
}
